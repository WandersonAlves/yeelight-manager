import { AddressInfo, Socket as TCPSocket, createServer } from 'net';
import { ColorFlowAction, ColorFlowExpressionMode, CommandList } from '../../enums';
import { CommandSignal } from '../../../modules/Yeelight/ReceiveCommand/ReceiveCommandInterfaces';
import { Either } from '../../../shared/contracts';
import { EventEmitter } from 'events';
import { GetValueFromString, HexToInteger } from '../../../utils';
import { jsonString, logger } from '../../../shared/Logger';
import ColorFlowExpression from './Flow';
import Command, {
  BrightCommand,
  ColorFlowCommand,
  ColorTemperatureCommand,
  EffectTypes,
  MusicModeCommand,
  NameCommand,
  RGBCommand,
  ToggleCommand,
} from './Commands';
import Screenshot from '../screenshot';
import UnsuportedCommandException from '../../../shared/exceptions/UnsuportedCommandException';

type Resolve = (value: void | PromiseLike<void>) => void;

export interface YeelightDeviceJSON {
  id: string;
  model: 'color';
  bright: number;
  rgbValue: number;
  colorTemperatureValue: number;
  hueValue?: number;
  saturationValue?: number;
  name: string;
  colorMode: 'RGB' | 'CT' | 'HSV';
  support: string[];
  power: boolean;
  host: string;
  port: number;
}

interface DataReceived {
  method?: string;
  params?: Params;
  id?: number;
  result?: [any];
}

interface Params {
  power: string;
}

export default class YeelightDevice {
  /**
   * Checks if given device is connected.
   * If not, then returns a promise that attempts to connect
   *
   * @param device A [YeelightDevice] type
   */
  static async ConnectDevice(device: YeelightDevice) {
    if (device.isConnected) {
      return;
    }
    return device.connect();
  }

  static ExecCommand(
    device: YeelightDevice,
    { kind, name, hex, ip, ct, brightlevel, deviceid }: CommandSignal,
  ): Either<Promise<void>> {
    switch (kind) {
      case CommandList.TOGGLE: {
        return [null, device.toggle()];
      }
      case CommandList.NAME: {
        return [null, device.setName(name)];
      }
      case CommandList.RGB: {
        return [null, device.setHex(hex)];
      }
      case CommandList.AMBILIGHT: {
        return [null, device.ambiLight({ width: 2560, height: 1080, ip })];
      }
      case CommandList.CANCEL_AMBILIGHT: {
        return [null, device.cancelAmbiLight(ip)];
      }
      case CommandList.CT: {
        return [null, device.setColorTemperature(ct)];
      }
      case CommandList.BRIGHT: {
        return [null, device.setBright(brightlevel)];
      }
      case CommandList.BLINK: {
        return [null, device.blinkDevice()];
      }
      default: {
        return [new UnsuportedCommandException(deviceid), null];
      }
    }
  }

  static CreateDevice(message: string) {
    const colorMode = parseInt(GetValueFromString(message, 'color_mode'));
    const host = GetValueFromString(message, 'Location').substr(11);

    return new YeelightDevice({
      id: GetValueFromString(message, 'id'),
      model: 'color',
      bright: parseInt(GetValueFromString(message, 'bright')),
      rgbValue: parseInt(GetValueFromString(message, 'rgb')),
      colorTemperatureValue: parseInt(GetValueFromString(message, 'ct')),
      name: GetValueFromString(message, 'name'),
      colorMode: colorMode === 1 ? 'RGB' : colorMode === 2 ? 'CT' : 'HSV',
      support: GetValueFromString(message, 'support').split(' '),
      power: GetValueFromString(message, 'power') === 'on' ? true : false,
      host: host.split(':')[0],
      port: parseInt(host.split(':')[1], 10),
    });
  }

  readonly id: string;
  private port: number;
  private host: string;
  private model: 'color';
  private support: string[];
  private power: boolean;
  private bright: number;
  // 1-RGB, 2-CT, 3-HSV
  private colorMode: 'RGB' | 'CT' | 'HSV';
  private colorTemperatureValue: number;
  private rgb: number;
  private name: string;
  private client: TCPSocket;
  private localAddress: string;
  private localPort: number;
  private server = createServer();
  private socket: TCPSocket;
  isConnected = false;
  private events = new EventEmitter();
  private commandId = 1;
  private interval;

  private constructor({ id, port, host, model, support, power, bright, colorMode, colorTemperatureValue, rgbValue, name }) {
    this.id = id;
    this.port = port;
    this.host = host;
    this.model = model;
    this.support = support;
    this.power = power;
    this.bright = bright;
    this.colorMode = colorMode;
    this.colorTemperatureValue = colorTemperatureValue;
    this.rgb = rgbValue;
    this.name = name;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new TCPSocket();
      logger.info(`Trying to connect into ${this.name || 'Yeelight'} in ${this.host}:${this.port}`, {
        label: this.name || 'Yeelight',
      });

      this.client.connect(this.port, this.host, () => {
        this.events.emit('connected');
        this.isConnected = true;
        logger.info(`Connected into ${this.name || 'Yeelight'}`, {
          label: this.name || 'Yeelight',
        });
        resolve();
      });

      this.client.on('data', data => {
        this.changeEvent(JSON.parse(data.toString()));
        this.events.emit('data', data);
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.events.emit('close_connection');
      });

      this.client.on('error', err => {
        this.events.emit('error', err);
        reject();
      });
    });
  }

  startMusicMode(currentIpAddress: string): Promise<void> {
    logger.info('Starting music mode');
    return new Promise((resolve, reject) => {
      try {
        this.server.listen(() => {
          logger.info('Server Created!', {
            label: this.name || 'Yeelight',
          });
          const ad = this.server.address() as AddressInfo;
          this.localAddress = ad.address;
          this.localPort = ad.port;
          logger.info(`TCP Server Info: ${this.localAddress}:${this.localPort}`, {
            label: this.name || 'Yeelight',
          });
          // Tell the lightbulb to try to connect to our server
          void this.sendCommand(new MusicModeCommand(true, currentIpAddress, this.localPort));
        });

        this.server.on('connection', sock => {
          logger.info('Device connected to server', {
            label: this.name || 'Yeelight',
          });
          // If the lightbulb connect succefully, it will be here on sock
          // Else it will print something like {"method":"props","params":{"music_on":0}} on client
          this.socket = sock;
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  finishMusicMode(currentIpAddress: string) {
    this.socket = null;
    this.server.close();
    return this.sendCommand(new MusicModeCommand(false, currentIpAddress, this.localPort));
  }

  async ambiLight({ width, height, interval = 300, ip }: { width: number; height: number; interval?: number; ip: string }) {
    await this.startMusicMode(ip);
    this.interval = setInterval(async () => {
      try {
        const color = await Screenshot.GetProeminentColor(width, height);
        return this.setHex(color, 'smooth', 300);
      } catch (e) {
        logger.error(e);
        void this.cancelAmbiLight(ip);
      }
    }, interval);
  }

  cancelAmbiLight(ip: string) {
    clearInterval(this.interval);
    return this.finishMusicMode(ip);
  }

  toggle() {
    return this.sendCommand(new ToggleCommand(this.commandId++));
  }

  setHex(hex: string, effect: EffectTypes = 'smooth', duration = 300) {
    return this.sendCommand(new RGBCommand(HexToInteger(hex), effect, duration, this.commandId++));
  }

  setFlow(repeat: number, action: ColorFlowAction, flows: ColorFlowExpression[]) {
    return this.sendCommand(new ColorFlowCommand(repeat, action, flows, this.commandId++));
  }

  setBright(level: number, effect: EffectTypes = 'smooth', duration = 300) {
    return this.sendCommand(new BrightCommand(level, effect, duration, this.commandId++));
  }

  setName(name: string) {
    return this.sendCommand(new NameCommand(name, this.commandId++));
  }

  setColorTemperature(ct: number, effect: EffectTypes = 'smooth', duration = 300) {
    return this.sendCommand(new ColorTemperatureCommand(ct, effect, duration, this.commandId++));
  }

  blinkDevice() {
    return this.setFlow(2, ColorFlowAction.RECOVER_STATE, [
      new ColorFlowExpression(1000, ColorFlowExpressionMode.TEMPERATURE, 4500, 100),
      new ColorFlowExpression(500, ColorFlowExpressionMode.TEMPERATURE, 4500, 1),
    ]);
  }

  toString(): YeelightDeviceJSON {
    return {
      id: this.id,
      model: this.model,
      bright: this.bright,
      rgbValue: this.rgb,
      colorTemperatureValue: this.colorTemperatureValue,
      name: this.name,
      colorMode: this.colorMode,
      support: this.support,
      power: this.power,
      host: this.host,
      port: this.port,
    };
  }

  private changeEvent(dataObj: DataReceived) {
    if (dataObj?.method === 'props') {
      const key = Object.keys(dataObj.params)[0];
      const value = dataObj.params[key];
      logger.verbose(`${key} changed to ${value}`, {
        label: this.name || 'Yeelight',
      });
      switch (key) {
        case 'color_mode': {
          this.colorMode = value === 1 ? 'RGB' : value === 2 ? 'CT' : 'HSV';
          break;
        }
        case 'power': {
          this.power = value === 'on' ? true : false;
          break;
        }
        default: {
          if (!Object.hasOwnProperty.call(this, key)) {
            logger.warn(`DataEvent updating unmapped ${key} key`, { label: this.name || 'Yeelight' });
          }
          this[key] = value;
          break;
        }
      }
    } else if (dataObj?.id && dataObj?.result[0] === 'ok') {
      logger.info(`Command with id ${dataObj.id} ran successfully`, { label: this.name || 'Yeelight' });
    } else {
      logger.warn(`Unmapped Event: ${jsonString(dataObj)}`, {
        label: this.name || 'Yeelight',
      });
    }
  }

  private sendCommand(command: Command): Promise<void> {
    const cmdName = command.name;
    const cmdJSON = command.toString();
    logger.debug(`Command sent: ${cmdJSON}`, {
      label: this.name || 'Yeelight',
    });
    const sharedCb = (resolve: Resolve, reject: (e: Error) => void) => (err: Error) => {
      if (err) {
        this.events.emit('command_failure', cmdJSON);
        return reject(err);
      }
      this.events.emit('command_success', cmdJSON);
      resolve();
    };
    return new Promise((resolve, reject) => {
      if (!this.client && !this.isConnected) {
        return reject(new Error('DeviceNotConnected'));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.socket && cmdName !== 'set_music'
        ? this.socket.write(cmdJSON, sharedCb(resolve, reject))
        : this.client.write(cmdJSON, sharedCb(resolve, reject));
    });
  }
}
