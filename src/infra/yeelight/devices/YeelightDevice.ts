import { AddressInfo, Socket as TCPSocket, createServer } from 'net';
import { ColorFlowAction, ColorFlowExpressionMode } from '../../enums';
import { EventEmitter } from 'events';
import { GetValueFromString, HexToInteger } from '../../../utils';
import { logger } from '../../../shared/Logger';
import ColorFlowExpression from './Flow';
import Command, { ColorFlowCommand, EffectTypes, MusicModeCommand, RGBCommand, ToggleCommand } from './Commands';


export interface YeelightDeviceJSON {
  id: string;
  model: 'color';
  bright: number;
  rgbValue: number;
  colorTemperatureValue: number;
  hueValue: number;
  saturationValue: number;
  name: string;
  colorMode: 'RGB' | 'CT' | 'HSV';
  support: string[];
  power: boolean;
  host: string;
  port: number;
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

  static CreateDevice(message: string) {
    const colorMode = parseInt(GetValueFromString(message, 'color_mode'));
    const host = GetValueFromString(message, 'Location').substr(11);

    return new YeelightDevice({
      id: GetValueFromString(message, 'id'),
      model: 'color',
      bright: parseInt(GetValueFromString(message, 'bright')),
      rgbValue: parseInt(GetValueFromString(message, 'rgb')),
      colorTemperatureValue: parseInt(GetValueFromString(message, 'ct')),
      hueValue: parseInt(GetValueFromString(message, 'hue')),
      saturationValue: parseInt(GetValueFromString(message, 'sat')),
      name: GetValueFromString(message, 'name'),
      colorMode: colorMode === 1 ? 'RGB' : colorMode === 2 ? 'CT' : 'HSV',
      support: GetValueFromString(message, 'support').split(' '),
      power: GetValueFromString(message, 'power') === 'on' ? true : false,
      host: host.split(':')[0],
      port: parseInt(host.split(':')[1], 10),
    });
  }

  readonly id: string;
  readonly port: number;
  readonly host: string;
  readonly model: 'color';
  readonly support: string[];
  power: boolean;
  bright: number;
  // 1-RGB, 2-CT, 3-HSV
  colorMode: 'RGB' | 'CT' | 'HSV';
  colorTemperatureValue: number;
  rgbValue: number;
  hueValue: number;
  saturationValue: number;
  name: string;
  private client: TCPSocket;
  private localAddress: string;
  private localPort: number;
  private server = createServer();
  private socket: TCPSocket;
  isConnected = false;
  events = new EventEmitter();
  private commandId = 1;

  private constructor({
    id,
    port,
    host,
    model,
    support,
    power,
    bright,
    colorMode,
    colorTemperatureValue,
    rgbValue,
    hueValue,
    saturationValue,
    name,
  }) {
    this.id = id;
    this.port = port;
    this.host = host;
    this.model = model;
    this.support = support;
    this.power = power;
    this.bright = bright;
    this.colorMode = colorMode;
    this.colorTemperatureValue = colorTemperatureValue;
    this.rgbValue = rgbValue;
    this.hueValue = hueValue;
    this.saturationValue = saturationValue;
    this.name = name;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new TCPSocket();
      logger.info(`Trying to connect into ${this.name || 'Yeelight'} in ${this.host}:${this.port}`);

      this.client.connect(this.port, this.host, () => {
        this.events.emit('connected');
        this.isConnected = true;
        logger.info(`Connected into ${this.name || 'Yeelight'}`);
        resolve();
      });

      this.client.on('data', data => {
        this.events.emit('data', data);
      });

      this.client.on('close', () => {
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
          logger.info('Server Created!');
          const ad = this.server.address() as AddressInfo;
          this.localAddress = ad.address;
          this.localPort = ad.port;
          logger.info(`TCP Server Info: ${this.localAddress}:${this.localPort}`);
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

  toggle() {
    return this.sendCommand(new ToggleCommand());
  }

  setHex(hex: string, effect: EffectTypes = 'smooth', duration = 300) {
    return this.sendCommand(new RGBCommand(HexToInteger(hex), effect, duration, this.commandId++));
  }

  setFlow(repeat: number, action: ColorFlowAction, flows: ColorFlowExpression[]) {
    return this.sendCommand(new ColorFlowCommand(repeat, action, flows));
  }

  blinkDevice() {
    return this.setFlow(2, ColorFlowAction.RECOVER_STATE, [
      new ColorFlowExpression(350, ColorFlowExpressionMode.TEMPERATURE, 6500, 100),
      new ColorFlowExpression(200, ColorFlowExpressionMode.TEMPERATURE, 6500, 1),
      new ColorFlowExpression(1000, ColorFlowExpressionMode.SLEEP, 0, 0),
    ]);
  }

  toString(): YeelightDeviceJSON {
    return {
      id: this.id,
      model: this.model,
      bright: this.bright,
      rgbValue: this.rgbValue,
      colorTemperatureValue: this.colorTemperatureValue,
      hueValue: this.hueValue,
      saturationValue: this.saturationValue,
      name: this.name,
      colorMode: this.colorMode,
      support: this.support,
      power: this.power,
      host: this.host,
      port: this.port,
    };
  }

  private sendCommand(command: Command): Promise<void> {
    const cmdName = command.name;
    const cmdJSON = command.toString();
    const sharedCb = (resolve: () => void, reject: (e: Error) => void) => (err: Error) => {
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
