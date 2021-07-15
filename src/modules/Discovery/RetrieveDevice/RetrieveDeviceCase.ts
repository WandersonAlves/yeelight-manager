import { UseCase, UseCaseParams } from "../../../shared/contracts";
import { inject, injectable } from "inversify";
import Discovery from "../../../infra/yeelight/discovery";
import HttpResponse from "../../../shared/responses/HttpResponse";

@injectable()
export default class RetrieveDeviceCase implements UseCase {
  @inject(Discovery) private discovery: Discovery;

  async execute({ headers }: UseCaseParams<{ deviceid: string }>) {
    const device = this.discovery.findDevice(headers.deviceid);
    return HttpResponse.success(200, device ? device.toObject() : null);
  }
}