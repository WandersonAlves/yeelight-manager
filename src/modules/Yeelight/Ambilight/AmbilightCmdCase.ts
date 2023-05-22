import { DominantColorResponse } from '../../../infra/screenshot';
import { EffectTypes } from '../../../infra/yeelight/devices/Commands';
import { UseCase } from '../../../shared/contracts';
import { address } from 'ip';
import { inject, injectable } from 'inversify';
import { jsonString, labeledLogger } from '../../../shared/Logger';
import { spawn } from 'child_process';
import Discovery from '../../../infra/yeelight/discovery/Discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
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
export default class AmbilightCmdCase implements UseCase<AmbilightCaseParams, void> {
  @inject(Discovery) private discovery: Discovery;
  private logger = labeledLogger('ambilightCase');

  @ExceptionHandler()
  async execute(params: AmbilightCaseParams): Promise<void> {
    const { deviceNames, interval = 300, width, height, x, y, useLuminance } = params;

    this.logger('debug', `Received parameters ${jsonString(params)}`);

    const ip = address();
    const selectedDevices = await this._discoverDevices(deviceNames);

    this._startSignalHandlers(selectedDevices, ip);

    await this._turnOnDevices(selectedDevices, ip);

    this._spawnAmbilightWorker(x, y, width, height, interval, selectedDevices, useLuminance, ip);
    // Wait forever until user closes the application
    await new Promise(() => null);
  }

  private async _discoverDevices(deviceNames: string[]) {
    const devices = await this.discovery.discoverDevices();

    if (!devices.length) {
      this.logger('error', 'No devices found');
      return process.exit(0);
    }
    const selectedDevices = devices.filter(d => deviceNames.includes(d.name));
    if (!selectedDevices.length) {
      this.logger('error', "Specified devices can't be found");
      return process.exit(0);
    }

    return selectedDevices;
  }

  private _spawnAmbilightWorker(
    x: number,
    y: number,
    width: number,
    height: number,
    interval: number,
    selectedDevices: YeelightDevice[],
    useLuminance: boolean,
    ip: string,
  ) {
    const childProcess = spawn(
      'ts-node',
      [__dirname + '/AmbilightWorker.ts', x.toString(), y.toString(), width.toString(), height.toString(), interval.toString()],
      { stdio: 'pipe' },
    );

    childProcess.stderr.on('data', (data: string) => {
      console.error(data.toString());
      process.exit(1);
    });

    childProcess.stdout.on('data', (data: string) => {
      let result: DominantColorResponse;
      try {
        this.logger('debug', `Values from worker: ${data.toString()}`);
        result = JSON.parse(data.toString().trim());
      } catch (e) {
        this.logger('warn', e);
        return;
      }
      this._ambilightResultHandler(result, interval, selectedDevices, useLuminance, ip);
    });
  }

  private async _turnOnDevices(selectedDevices: YeelightDevice[], ip: string) {
    await Promise.all(selectedDevices.map(d => d.connect()));
    await this.discovery.turnOnAll(selectedDevices);
    await this.discovery.musicModeAll(ip, selectedDevices);
  }

  private _startSignalHandlers(selectedDevices: YeelightDevice[], ip: string) {
    this.logger('debug', 'Adding signal listeners');
    process.stdin.resume();
    process.on('SIGINT', () => {
      this._signalHandler(selectedDevices, ip);
    });
    process.on('SIGQUIT', () => {
      this._signalHandler(selectedDevices, ip);
    });
    process.on('SIGTERM', () => {
      this._signalHandler(selectedDevices, ip);
    });
    this.logger('debug', 'Listeners added');
  }

  private _signalHandler(selectedDevices: YeelightDevice[], ip: string) {
    console.log('\n');
    selectedDevices.forEach(d => void d.finishMusicMode(ip));
    this.logger('info', '🦄 See you soon');
    process.exit(0);
  }

  private _ambilightResultHandler(
    obj: DominantColorResponse,
    interval: number,
    selectedDevices: YeelightDevice[],
    useLuminance: boolean,
    ip: string,
  ) {
    const { factor, luminance, color, isBlackShade } = obj;
    try {
      const effectType: EffectTypes = factor < 0.10 ? 'sudden' : 'smooth';
      selectedDevices.forEach(async d => {
        if (useLuminance) {
          void d.setBright(Number(luminance), effectType, interval);
        }
        void d.setHex(color, effectType, interval);
      });
    } catch (e) {
      const err: Error = e;
      this.logger('error', err.toString());
      selectedDevices.forEach(d => void d.finishMusicMode(ip, true));
      process.exit(1);
    }
  }
}
