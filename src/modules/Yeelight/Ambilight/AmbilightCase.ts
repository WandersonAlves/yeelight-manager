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
}

@injectable()
export default class AmbilightCase implements UseCase<AmbilightCaseParams, void> {
  @inject(Discovery) private discovery: Discovery;
  private _interval: NodeJS.Timeout;

  @ExceptionHandler()
  async execute(params: AmbilightCaseParams): Promise<void> {
    const { deviceNames, interval = 300, width, height, x, y } = params;
    logger.debug(`Received parameters ${jsonString(params)}`, { label: 'ambilightCase' });
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
          selectedDevices.forEach(async d => {
            void d.setBright(Number(luminance), 'sudden');
            void d.setHex(color, interval < 33 ? 'sudden' : 'smooth', interval);
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
