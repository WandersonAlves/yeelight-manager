import { UseCase } from '../../../shared/contracts';
import { YeelightDeviceJSON } from '../../../infra/yeelight/devices/YeelightDevice';
import { inject, injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import Discovery from '../../../infra/yeelight/discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import HttpResponse from '../../../shared/responses/HttpResponse';

@injectable()
export default class DiscoverDevicesCase implements UseCase<YeelightDeviceJSON> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute({ headers }: { headers: { waitTime?: number } }) {
    logger.info('Discovery started...', { label: 'Discovery' });
    await this.discovery.discoverDevices(headers.waitTime);
    const devices = this.discovery.getDevices();
    logger.info(`Found ${devices.length} devices via SSDP.`, { label: 'Discovery' });
    if (!devices.length) {
      logger.info('Performing IP scan to find devices.', { label: 'Discovery'});
      const devicesFallback = await this.discovery.discoverDevicesFallback();
      logger.info(`Found ${devicesFallback.length} devices via IP scan.`, { label: 'Discovery' });
      logger.info('Discovery finished.', { label: 'Discovery' });
      return HttpResponse.success(
        200,
        devicesFallback.map(d => d.toObject()),
      );
    }
    logger.info('Discovery finished.', { label: 'Discovery' });
    return HttpResponse.success(
      200,
      devices.map(d => d.toObject()),
    );
  }
}
