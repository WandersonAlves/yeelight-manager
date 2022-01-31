import { CommandSignal } from './ReceiveCommandInterfaces';
import { IHttpError, UseCase, UseCaseParams } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import DeviceNotFoundException from '../../../shared/exceptions/DeviceNotFoundException';
import Discovery from '../../../infra/yeelight/discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import HttpResponse from '../../../shared/responses/HttpResponse';
import YeelightDevice from '../../../infra/yeelight/devices/YeelightDevice';

@injectable()
export default class ReceiveCommandCase implements UseCase<any, IHttpError> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute({ headers }: UseCaseParams<CommandSignal & { deviceNames?: string[]; manualConnect?: boolean }>) {
    const { deviceNames, kind } = headers;
    const devices = this.discovery.getDevices();
    const selectedDevices = devices.filter(
      d => deviceNames.includes(d.name) || deviceNames.includes(d.host) || deviceNames.includes(d.id),
    );
    if (!selectedDevices.length) {
      logger.error("Specified devices can't be found. Try again or check if device is on the same network", {
        label: 'Discovery',
      });
      return HttpResponse.error(new DeviceNotFoundException(deviceNames.join(',')));
    }
    if (!headers.manualConnect) {
      await Promise.all(selectedDevices.map(d => d.connect()));
    }
    const results = await Promise.all(selectedDevices.map(d => YeelightDevice.ExecCommand(d, headers)));
    await Promise.all(results.map(([, promise]) => promise));
    logger.info('Command Success!!!');
    return HttpResponse.success(200, { deviceNames, kind });
  }
}
