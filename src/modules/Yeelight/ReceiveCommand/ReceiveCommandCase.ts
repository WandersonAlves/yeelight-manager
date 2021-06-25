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
  async execute({ headers }: UseCaseParams<CommandSignal>) {
    const { deviceid, kind } = headers;
    const device = this.discovery.findDevice(deviceid);
    if (!device) {
      return HttpResponse.error(new DeviceNotFoundException(deviceid));
    }
    const [err, deviceCmdPromise] = await YeelightDevice.ExecCommand(device, headers);
    if (err) {
      return HttpResponse.error(err);
    }
    await deviceCmdPromise;
    logger.info('Command Success!!!');
    return HttpResponse.success(200, { deviceid, kind });
  }
}
