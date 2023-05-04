import { AddressInfo, Socket as TCPSocket, createServer } from 'net';
import { ColorFlowAction, ColorFlowExpressionMode, CommandList } from '../../enums';
import { CommandSignal } from '../../../modules/Yeelight/ReceiveCommand/ReceiveCommandInterfaces';
import { Either } from '../../../shared/contracts';
import { EventEmitter } from 'events';
import { GetValueFromString, HexToInteger } from '../../../utils';
import { jsonString, logger } from '../../../shared/Logger';
import ColorFlowExpression from './ColorFlowExpression';
import Command, {
  BrightCommand,
  ColorFlowCommand,
  ColorTemperatureCommand,
  EffectTypes,
  MusicModeCommand,
  NameCommand,
  PowerCommand,
  RGBCommand,
  ToggleCommand,
} from './Commands';
import UnsuportedCommandException from '../../../shared/exceptions/UnsuportedCommandException';

type ResolveFn = (value: void | PromiseLike<void>) => void;
type RejectFn = (e: Error) => void;

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
  params?: Record<string, string | number>;
  id?: number;
  result?: [any];
}

export default class YeelightDevice {
  static YeelightDefaultPort = 55443;
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

  static async ExecCommand(device: YeelightDevice, { kind, value, bright }: CommandSignal): Promise<Either<Promise<void>>> {
    if (bright && kind !== CommandList.BRIGHT) {
      void device.setBright(Number(bright));
    }
    switch (kind) {
      case CommandList.TOGGLE: {
        return [null, device.toggle()];
      }
      case CommandList.POWER: {
        return [null, device.setPower(value as 'on' | 'off')];
      }
      case CommandList.NAME: {
        return [null, device.setName(value)];
      }
      case CommandList.COLOR: {
        return [null, device.setHex(YeelightDevice.FetchColor(value))];
      }
      case CommandList.CT3:
      case CommandList.CT2:
      case CommandList.CT: {
        return [null, device.setColorTemperature(Number(value))];
      }
      case CommandList.BRIGHT: {
        return [null, device.setBright(Number(value))];
      }
      case CommandList.BLINK: {
        return [null, device.blinkDevice()];
      }
      case CommandList.FLOW: {
        return [null, device.setFlow(1, null, [])];
      }
      default: {
        return [new UnsuportedCommandException(device.id, kind, value), null];
      }
    }
  }
  /**
   * Returns a hex value based on input.
   *
   * If the value is a well-know color name, it'll return the hex for that color. Otherwise, returns the given value
   *
   * @param value Hex or color name
   * @returns Hex value for given string
   */
  private static FetchColor(value: string) {
    const innerValue = value.replace('#', '');
    switch (innerValue) {
      case 'red': {
        return 'FF0000';
      }
      case 'blue': {
        return '0000FF';
      }
      case 'green': {
        return '00FF00';
      }
      case 'cyan': {
        return '00FFFF';
      }
      case 'purple': {
        return '800080';
      }
      case 'pink': {
        return 'FFC0CB';
      }
      case 'orange': {
        return 'FFA500';
      }
      case 'yellow': {
        return 'FFFF00';
      }
      default: {
        return innerValue;
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

  static CreateDeviceByIp(ip: string, port: number) {
    return new YeelightDevice({
      host: ip,
      port,
      bright: 'unknow',
      colorMode: 'unknow',
      colorTemperatureValue: 'unknow',
      id: 'unknow',
      model: 'unknow',
      name: 'unknow',
      power: 'unknow',
      rgbValue: 'unknow',
      support: 'unknow',
    });
  }

  readonly id: string;
  readonly port: number;
  readonly host: string;
  private _model: 'color';
  private _support: string[];
  private _power: boolean;
  private _bright: number;
  // 1-RGB, 2-CT, 3-HSV
  private _colorMode: 'RGB' | 'CT' | 'HSV';
  private _colorTemperatureValue: number;
  private _rgb: number;
  name: string;
  private _client: TCPSocket;
  private _localAddress: string;
  private _localPort: number;
  private _server = createServer();
  private _socket: TCPSocket;
  isConnected = false;
  private _events = new EventEmitter();
  private _commandId = 1;

  get power() {
    return this._power;
  }

  private constructor({ id, port, host, model, support, power, bright, colorMode, colorTemperatureValue, rgbValue, name }) {
    this.id = id;
    this.port = port;
    this.host = host;
    this._model = model;
    this._support = support;
    this._power = power;
    this._bright = bright;
    this._colorMode = colorMode;
    this._colorTemperatureValue = colorTemperatureValue;
    this._rgb = rgbValue;
    this.name = name;
  }

  connect(): Promise<void> {
    return new Promise(resolve => {
      const _connect = () => {
        this.log('info', `⚡ Trying to connect into ${this._name} in ${this.host}:${this.port}`);
        if (!this._socket && !this.isConnected) {
          _createSocket();
        }
        this._client.connect(this.port, this.host, () => {
          this._events.emit('connected');
          this.isConnected = true;
          this.log('info', `💡 Connected into ${this._name}`);
          resolve();
        });
      };

      const _handleYeelightConnectionEvents = () => {
        this._client.on('error', err => {
          this.log('error', err.name);
          this.log('warn', `⚡ Trying to re-connect to ${this._name}`);
          this.isConnected = false;
          this._client.removeAllListeners();
          this._client = null;
          _connect();
        });

        this._client.on('data', data => {
          const responses = data.toString().split('\n');
          responses.forEach(r => {
            if (r) {
              const parsed = JSON.parse(r);
              this.log('debug', `Change event ${parsed}`)
              this.changeEvent(parsed);
              this._events.emit('data', r);
            }
          });
        });

        this._client.on('close', () => {
          this.isConnected = false;
          this._events.emit('close_connection');
        });
      };

      const _createSocket = () => {
        this._client = new TCPSocket();
      };

      if (this.isConnected) {
        return resolve();
      }

      _createSocket();
      _handleYeelightConnectionEvents();
      _connect();
    });
  }

  startMusicMode(currentIpAddress: string): Promise<void> {
    this.log('info', '📀 Starting music mode');
    return new Promise((resolve, reject) => {
      try {
        this._server.listen(() => {
          this.log('info', '⚡ Server Created!');
          const ad = this._server.address() as AddressInfo;
          this._localAddress = ad.address;
          this._localPort = ad.port;
          this.log('info', `⚡ TCP Server Info: ${this._localAddress}:${this._localPort}`);
          // Tell the lightbulb to try to connect to our server
          void this.sendCommand(new MusicModeCommand(true, currentIpAddress, this._localPort));
        });

        this._server.on('connection', sock => {
          this.log('info', '⚡ Device connected to server');
          // If the lightbulb connect succefully, it will be here on sock
          // Else it will print something like {"method":"props","params":{"music_on":0}} on client
          this._socket = sock;
          resolve();
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  finishMusicMode(currentIpAddress: string, fromError?: boolean) {
    this._socket = null;
    this._server.close();
    this.log(fromError ? 'error' : 'info', '📀 Finishing music mode');
    return this.sendCommand(new MusicModeCommand(false, currentIpAddress, this._localPort));
  }

  toggle() {
    return this.sendCommand(new ToggleCommand(this._commandId++));
  }

  setHex(hex: string, effect: EffectTypes = 'smooth', duration = 300) {
    this.prepareDevice();
    return this.sendCommand(new RGBCommand(HexToInteger(hex), effect, duration, this._commandId++));
  }

  setFlow(repeat: number, action: ColorFlowAction, flows: ColorFlowExpression[]) {
    return this.sendCommand(new ColorFlowCommand(repeat, action, flows, this._commandId++));
  }

  setBright(level: number, effect: EffectTypes = 'smooth', duration = 300) {
    this.prepareDevice();
    return this.sendCommand(new BrightCommand(level, effect, duration, this._commandId++));
  }

  setName(name: string) {
    return this.sendCommand(new NameCommand(name, this._commandId++));
  }

  setColorTemperature(ct: number, effect: EffectTypes = 'smooth', duration = 300) {
    this.prepareDevice();
    return this.sendCommand(new ColorTemperatureCommand(ct, effect, duration, this._commandId++));
  }

  setPower(power: 'on' | 'off', effect: EffectTypes = 'smooth', duration = 300) {
    return this.sendCommand(new PowerCommand(power, effect, duration));
  }

  blinkDevice() {
    return this.setFlow(1, ColorFlowAction.RECOVER_STATE, [
      new ColorFlowExpression(750, ColorFlowExpressionMode.TEMPERATURE, 9999, 100),
      new ColorFlowExpression(750, ColorFlowExpressionMode.TEMPERATURE, 9999, 1),
    ]);
  }

  toObject(): YeelightDeviceJSON {
    return {
      id: this.id,
      model: this._model,
      bright: this._bright,
      rgbValue: this._rgb,
      colorTemperatureValue: this._colorTemperatureValue,
      name: this.name,
      colorMode: this._colorMode,
      support: this._support,
      power: this._power,
      host: this.host,
      port: this.port,
    };
  }

  private prepareDevice() {
    if (!this._power) {
      void this.setPower('on');
    }
  }

  private changeEvent(dataObj: DataReceived) {
    if (dataObj?.method === 'props') {
      const key = Object.keys(dataObj.params)[0];
      const value = dataObj.params[key];
      this.log('verbose', `${key} changed to ${value}`);
      switch (key) {
        case 'color_mode': {
          this._colorMode = value === 1 ? 'RGB' : value === 2 ? 'CT' : 'HSV';
          break;
        }
        case 'power': {
          this._power = value === 'on' ? true : false;
          break;
        }
        case 'ct': {
          this._colorTemperatureValue = Number(value);
          break;
        }
        default: {
          if (!Object.hasOwnProperty.call(this, key)) {
            this.log('warn', `Event updating unmapped ${key} key`);
          }
          this[key] = value;
          break;
        }
      }
    } else if (dataObj?.id && dataObj?.result?.[0] === 'ok') {
      this.log('info', `Command with id ${dataObj.id} ran successfully`);
    } else {
      this.log('warn', `Unmapped Event: ${jsonString(dataObj)}`);
    }
  }

  private sendCommand(command: Command): Promise<void> {
    const cmdName = command.name;
    const cmdJSON = command.toString();
    this.log('debug', `Command sent: ${cmdJSON}`);
    const sharedCb = (resolve: ResolveFn, reject: RejectFn) => (err: Error) => {
      if (err) {
        this._events.emit('command_failure', cmdJSON);
        return reject(err);
      }
      this._events.emit('command_success', cmdJSON);
      return resolve();
    };
    return new Promise((resolve, reject) => {
      if (!this._client && !this.isConnected) {
        return reject(new Error('DeviceNotConnected'));
      }
      if (this._socket && cmdName !== 'set_music') {
        return this._socket.write(cmdJSON, sharedCb(resolve, reject));
      }
      return this._client.write(cmdJSON, sharedCb(resolve, reject));
    });
  }

  private get _name() {
    return this.name ? this.name : this.id;
  }

  private log(type: 'info' | 'warn' | 'error' | 'debug' | 'verbose', str: string) {
    logger[type](str, { label: this._name });
  }
}
