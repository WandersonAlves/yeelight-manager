import { CommandList } from '../../../infra/enums';
import { DeviceCmd } from './SetxCommandInterface';
import { UseCase } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import DiscoverDevicesCase from '../../Discovery/DiscoverDevices/DiscoverDevicesCase';
import Discovery from '../../../infra/yeelight/discovery/Discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import GenericException from '../../../shared/exceptions/GenericException';
import ReceiveCommandCase from '../ReceiveCommand/ReceiveCommandCase';

@injectable()
export default class SetxCommandCase implements UseCase<string, null> {
  @inject(DiscoverDevicesCase) private discoverDevices: DiscoverDevicesCase;
  @inject(Discovery) private discovery: Discovery;
  @inject(ReceiveCommandCase) private receiveCmdCase: ReceiveCommandCase;

  @ExceptionHandler()
  async execute(rawString: string): Promise<null> {
    const cmds: DeviceCmd[] = SetxCommandCase.ProcessRawString(rawString);
    SetxCommandCase.ValidateDeviceCmds(cmds, rawString);

    await this.discoverDevices.execute();
    const promises: Promise<any>[] = [];
    await Promise.all(cmds.map(cmd => this.discovery.findDevice(cmd.device).connect()));
    cmds.forEach(cmd => {
      cmd.signals.forEach(signal => {
        promises.push(
          this.receiveCmdCase.execute({
            manualConnect: true,
            kind: signal.kind,
            value: signal.value,
            deviceNames: [cmd.device],
          }),
        );
      });
    });

    await Promise.all(promises);
    return null;
  }

  static ValidateDeviceCmds(cmds: DeviceCmd[], rawString: string) {
    if (cmds.find(c => !c.signals.length)) {
      throw new GenericException({ name: 'MalformedSetxStringException', message: `Provided string is broken: ${rawString}` });
    }
    return;
  }

  static ProcessRawString(rawString: string): DeviceCmd[] {
    const rawSplited = rawString.split(' ');
    const cmds: DeviceCmd[] = [];

    rawSplited.forEach(str => {
      if (!str.includes('=')) {
        if (str[str.length - 1] === "'") {
          cmds[cmds.length - 1].device = `${cmds[cmds.length - 1].device} ${str}`;
          cmds[cmds.length - 1].device = cmds[cmds.length - 1].device.split("'").join('');
          return;
        }
        return cmds.push({
          device: str,
          signals: [],
        });
      }
      const [kind, value] = str.split('=') as [kind: CommandList, value: string];
      cmds[cmds.length - 1].signals.push({ kind, value });
    });

    return cmds;
  }
}
