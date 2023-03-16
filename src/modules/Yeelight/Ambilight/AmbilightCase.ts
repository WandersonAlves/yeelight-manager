import { UseCase } from '../../../shared/contracts';
import { address } from 'ip';
import { inject, injectable } from 'inversify';
import { jsonString, logger } from '../../../shared/Logger';
import Discovery from '../../../infra/yeelight/discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import Screenshot from '../../../infra/screenshot';

interface AmbilightCaseParams {
  interval?: number;
  width: number;
  height: number;
  deviceNames: string[];
}

@injectable()
export default class AmbilightCase implements UseCase<AmbilightCaseParams, void> {
  @inject(Discovery) private discovery: Discovery;
  private _interval: NodeJS.Timeout;

  @ExceptionHandler()
  async execute(params: AmbilightCaseParams): Promise<void> {
    const { deviceNames, interval = 300, width, height } = params;
    logger.debug(`Received parameters ${jsonString(params)}`, { label: 'ambilightCase' });
    const ip = address();
    const devices = await this.discovery.discoverDevices();
    if (!devices.length) {
      process.exit(0);
    }
    process.on('SIGINT', () => {
      selectedDevices.forEach(d => void d.finishMusicMode(ip));
      clearInterval(this._interval);
      process.exit(0);
    });
    const selectedDevices = devices.filter(d => deviceNames.includes(d.name));

    await Promise.all(selectedDevices.map(d => d.connect()));
    await this.discovery.turnOnAll(selectedDevices);
    await this.discovery.musicModeAll(ip, selectedDevices);
    await new Promise(async resolve => {
      this._interval = setInterval(async () => {
        try {
          const { color, luminance } = await Screenshot.FetchPredominantColor(0,0,width, height);
          selectedDevices.forEach(async d => {
            // void d.setBright(Number(luminance), 'smooth', interval);
            void d.setHex(color, 'smooth', interval);
          });
        } catch (e) {
          logger.error(e);
          selectedDevices.forEach(d => void d.finishMusicMode(ip, true));
          resolve(null);
        }
      }, interval);
    });
  }
}
