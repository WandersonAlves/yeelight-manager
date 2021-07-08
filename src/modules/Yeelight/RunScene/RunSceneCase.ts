import { CommandSignal } from "../ReceiveCommand/ReceiveCommandInterfaces";
import { IHttpError, UseCase, UseCaseParams } from "../../../shared/contracts";
import { RunSceneBody } from "./RunSceneInterface";
import { inject, injectable } from "inversify";
import DeviceNotFoundException from "../../../shared/exceptions/DeviceNotFoundException";
import Discovery from "../../../infra/yeelight/discovery";
import ExceptionHandler from "../../../shared/decorators/ExceptionHandler";
import HttpResponse from "../../../shared/responses/HttpResponse";
import YeelightDevice from "../../../infra/yeelight/devices/YeelightDevice";

// NOTE WIP
@injectable()
export default class RunSceneCase implements UseCase<CommandSignal[], IHttpError> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute({ body }: UseCaseParams<void, RunSceneBody>) {
    const cmds = body.commands;
    const devicesNotFound: string[] = [];
    cmds.forEach(async cmd => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const device = this.discovery.findDevice(cmd.deviceid);
      if (!device) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return devicesNotFound.push(cmd.deviceid);
      }
      const [err, deviceCmdPromise] = await YeelightDevice.ExecCommand(device, cmd);
      if (err) {
        return HttpResponse.error(err);
      }
      await deviceCmdPromise;
    });
    if (devicesNotFound.length) {
      return HttpResponse.error(new DeviceNotFoundException(devicesNotFound.toString()));
    }
    else {
      return HttpResponse.success(200, cmds)
    }
  }

}