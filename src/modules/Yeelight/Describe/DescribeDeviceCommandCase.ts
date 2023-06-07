import { UseCase } from "../../../shared/contracts";
import { inject, injectable } from "inversify";
import { jsonString, logger } from "../../../shared/Logger";
import DeviceNotFoundException from "../../../shared/exceptions/DeviceNotFoundException";
import Discovery from "../../../infra/yeelight/discovery/Discovery";
import ExceptionHandler from "../../../shared/decorators/ExceptionHandler";
import GenericException from "../../../shared/exceptions/GenericException";

@injectable()
export default class DescribeDeviceCommandCase implements UseCase<string[], void | GenericException> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute(deviceNames: string[]): Promise<void | GenericException> {
    const foundDevices = await this.discovery.discoverDevices();
    const selectedDevices = foundDevices.filter(d => deviceNames.includes(d.name));
    if (!selectedDevices.length) {
      logger.error("Specified devices can't be found. Try again or check if device is on the same network", {
        label: 'Discovery',
      });
      return new DeviceNotFoundException(deviceNames.join(','));
    }
    selectedDevices.forEach((d, i) => {
      logger.info(`#${i} Name: ${d.name} - IP: ${d.host}:${d.port} ${jsonString(d.describe())}`);
    });
    return null;
  }
}