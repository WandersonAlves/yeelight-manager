import { CommandList } from '../../../infra/enums';
import { IHttpError, UseCase, UseCaseParams } from '../../../shared/contracts';
import { ReceiveCommandCaseHeaders } from './ReceiveCommandInterfaces';
import { inject, injectable } from 'inversify';
import DeviceNotFoundException from '../../../shared/exceptions/DeviceNotFoundException';
import Discovery from '../../../infra/yeelight/discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import HttpResponse from '../../../shared/responses/HttpResponse';
import UnsuportedCommandException from '../../../shared/exceptions/UnsuportedCommandException';
import YeelightDevice from '../../../infra/yeelight/devices/YeelightDevice';

@injectable()
export default class ReceiveCommandCase implements UseCase<any, IHttpError> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute({ headers }: UseCaseParams<ReceiveCommandCaseHeaders>) {
    const { deviceid, kind, command } = headers;
    const device = this.discovery.findDevice(deviceid);
    if (!device) {
      return HttpResponse.error(new DeviceNotFoundException(deviceid));
    }
    await YeelightDevice.ConnectDevice(device);
    switch (kind) {
      case CommandList.TOGGLE: {
        await device.toggle();
        break;
      }
      default: {
        return HttpResponse.error(new UnsuportedCommandException(deviceid));
      }
    }
    return HttpResponse.success(200, { deviceid, kind });
  }
}
