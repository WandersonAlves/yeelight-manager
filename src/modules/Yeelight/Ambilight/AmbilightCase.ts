import { UseCase } from '../../../shared/contracts';
import { address } from 'ip';
import { inject, injectable } from 'inversify';
import { jsonString, logger } from '../../../shared/Logger';
import Discovery from '../../../infra/yeelight/discovery/Discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import Screenshot from '../../../infra/screenshot/Screenshot';

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

  @ExceptionHandler()
  async execute(params: AmbilightCaseParams): Promise<void> {
    const { deviceNames, interval = 300, width, height, x, y, useLuminance } = params;
    logger.debug(`Received parameters ${jsonString(params)}`, { label: 'AmbilightCase' });
    const ip = address();
    const devices = await this.discovery.discoverDevices();
    if (!devices.length) {
      logger.error('No devices found', { label: 'ambilightCase' });
      return process.exit(0);
    }
    process.on('SIGINT', () => {
      selectedDevices.forEach(d => void d.finishMusicMode(ip));
      clearInterval(this._interval);
      process.exit(0);
    });
    const selectedDevices = devices.filter(d => deviceNames.includes(d.name));

    if (!selectedDevices.length) {
      logger.error("Specified devices can't be found", { label: 'ambilightCase' });
      return process.exit(0);
    }

    await Promise.all(selectedDevices.map(d => d.connect()));
    await this.discovery.turnOnAll(selectedDevices);
    await this.discovery.musicModeAll(ip, selectedDevices);
    await new Promise(async resolve => {
      this._interval = setInterval(() => {
        try {
          const { color, luminance } = Screenshot.FetchPredominantColor(x, y, width, height);
          const suddenSmooth = interval < 33 ? 'sudden' : 'smooth';
          selectedDevices.forEach(async d => {
            if (useLuminance) {
              void d.setBright(Number(luminance), suddenSmooth, interval);
            }
            void d.setHex(color, 'smooth', 200);
          });
        } catch (e) {
          logger.error(e);
          selectedDevices.forEach(d => void d.finishMusicMode(ip, true));
          resolve(null);
          process.exit(1);
        }
      }, interval);
    });
  }
}
