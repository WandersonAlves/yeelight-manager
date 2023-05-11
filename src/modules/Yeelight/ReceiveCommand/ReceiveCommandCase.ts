import { CommandList } from '../../../infra/enums';
import { CommandSignal } from './ReceiveCommandInterfaces';
import { UseCase } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import DeviceNotFoundException from '../../../shared/exceptions/DeviceNotFoundException';
import Discovery from '../../../infra/yeelight/discovery/Discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import GenericException from '../../../shared/exceptions/GenericException';
import YeelightDevice from '../../../infra/yeelight/devices/YeelightDevice';

type ReceiveCommandParams = CommandSignal & { deviceNames?: string[]; manualConnect?: boolean };
interface ReceiveCommandResponse { deviceNames: string[], kind: CommandList };
@injectable()
export default class ReceiveCommandCase implements UseCase<ReceiveCommandParams, ReceiveCommandResponse | GenericException> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute(params: ReceiveCommandParams): Promise<ReceiveCommandResponse | GenericException> {
    const { deviceNames, kind, manualConnect, bright } = params;
    const devices = this.discovery.getDevices();
    const selectedDevices = devices.filter(
      d => deviceNames.includes(d.name) || deviceNames.includes(d.host) || deviceNames.includes(d.id),
    );
    if (!selectedDevices.length) {
      logger.error("Specified devices can't be found. Try again or check if device is on the same network", {
        label: 'Discovery',
      });
      return new DeviceNotFoundException(deviceNames.join(','));
    }
    if (!manualConnect) {
      await Promise.all(selectedDevices.map(d => d.connect()));
    }
    if (bright && kind !== CommandList.BRIGHT) {
      await Promise.all(selectedDevices.map(d => d.setBright(Number(bright))))
    }
    // ExecCommand returns a array
    await Promise.all(selectedDevices.map(d => YeelightDevice.ExecCommand(d, params)));
    logger.info('Command(s) Success!!!', { label: ReceiveCommandCase.name });
    return { deviceNames, kind };
  }
}
