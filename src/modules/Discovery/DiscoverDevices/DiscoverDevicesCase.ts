import { UseCase } from "../../../shared/contracts";
import { YeelightDeviceJSON } from "../../../infra/yeelight/devices/YeelightDevice";
import { inject, injectable } from "inversify";
import Discovery from "../../../infra/yeelight/discovery";
import ExceptionHandler from "../../../shared/decorators/ExceptionHandler";
import HttpResponse from "../../../shared/responses/HttpResponse";

@injectable()
export default class DiscoverDevicesCase implements UseCase<YeelightDeviceJSON> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute() {
    await this.discovery.discoverDevices();
    const devices = this.discovery.getDevices();
    return HttpResponse.success(200, devices.map(d => d.toString()))
  }

}