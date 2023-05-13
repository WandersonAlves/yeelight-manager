import { UseCase } from '../../../shared/contracts';
import { address } from 'ip';
import { finishLoop } from '../../../infra/screenshot';
import { inject, injectable } from 'inversify';
import { jsonString, labeledLogger } from '../../../shared/Logger';
import Discovery from '../../../infra/yeelight/discovery/Discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import Screenshot from '../../../infra/screenshot/Screenshot';
import YeelightDevice from '../../../infra/yeelight/devices/YeelightDevice';

interface AmbilightCaseParams {
  interval?: number;
  width: number;
  height: number;
  x: number;
  y: number;
  deviceNames: string[];
  useLuminance?: boolean;
}

@injectable()
export default class AmbilightCase implements UseCase<AmbilightCaseParams, void> {
  @inject(Discovery) private discovery: Discovery;
  private _interval: NodeJS.Timeout;
  private logger = labeledLogger('ambilightCase');

  @ExceptionHandler()
  async execute(params: AmbilightCaseParams): Promise<void> {
    const { deviceNames, interval = 300, width, height, x, y, useLuminance } = params;

    this.logger('debug', `Received parameters ${jsonString(params)}`);

    const ip = address();
    const devices = await this.discovery.discoverDevices();

    if (!devices.length) {
      this.logger('error', 'No devices found');
      return process.exit(0);
    }

    const selectedDevices = devices.filter(d => deviceNames.includes(d.name));

    this.ListenSignals(selectedDevices, ip);

    if (!selectedDevices.length) {
      this.logger('error', "Specified devices can't be found");
      return process.exit(0);
    }

    await Promise.all(selectedDevices.map(d => d.connect()));
    await this.discovery.turnOnAll(selectedDevices);
    await this.discovery.musicModeAll(ip, selectedDevices);

    await new Promise(async () => {
      this._interval = setInterval(() => {
        const { color, luminance } = Screenshot.FetchPredominantColor(x, y, width, height);
        this.HandleAmbilightInterval(color, luminance, interval, selectedDevices, useLuminance, ip);
      }, interval);
    });
  }

  private ListenSignals(selectedDevices: YeelightDevice[], ip: string) {
    this.logger('debug', 'Adding signal listeners');
    process.stdin.resume();
    process.on('SIGINT', () => {
      this.HandleSignal(selectedDevices, ip);
    });
    process.on('SIGQUIT', () => {
      this.HandleSignal(selectedDevices, ip);
    });
    process.on('SIGTERM', () => {
      this.HandleSignal(selectedDevices, ip);
    });
    this.logger('debug', 'Listeners added');
  }

  private HandleSignal(selectedDevices: YeelightDevice[], ip: string) {
    finishLoop();
    selectedDevices.forEach(d => void d.finishMusicMode(ip));
    clearInterval(this._interval);
    this.logger('info', '👋🏾 See you soon');
    process.exit(0);
  }

  private HandleAmbilightInterval(
    color: string,
    luminance: number,
    interval: number,
    selectedDevices: YeelightDevice[],
    useLuminance: boolean,
    ip: string,
  ) {
    try {
      const suddenSmooth = interval < 33 ? 'sudden' : 'smooth';
      selectedDevices.forEach(async d => {
        if (useLuminance) {
          void d.setBright(Number(luminance), suddenSmooth, interval);
        }
        void d.setHex(color, 'smooth', 200);
      });
    } catch (e) {
      const err: Error = e;
      this.logger('error', err.toString());
      selectedDevices.forEach(d => void d.finishMusicMode(ip, true));
      process.exit(1);
    }
  }
}
