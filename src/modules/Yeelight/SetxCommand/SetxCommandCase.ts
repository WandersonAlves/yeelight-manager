import { CommandList } from '../../../infra/enums';
import { DeviceCmd } from './SetxCommandInterface';
import { UseCase, UseCaseParams } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import DiscoverDevicesCase from '../../Discovery/DiscoverDevices/DiscoverDevicesCase';
import Discovery from '../../../infra/yeelight/discovery';
import HttpResponse from '../../../shared/responses/HttpResponse';
import ReceiveCommandCase from '../ReceiveCommand/ReceiveCommandCase';

@injectable()
export default class SetxCommandCase implements UseCase {
  @inject(DiscoverDevicesCase) private discoverDevices: DiscoverDevicesCase;
  @inject(Discovery) private discovery: Discovery;
  @inject(ReceiveCommandCase) private receiveCmdCase: ReceiveCommandCase;
  async execute({ body }: UseCaseParams<any, string>) {
    const rawString = body;
    const cmds = this.processRawString(rawString);

    await this.discoverDevices.execute({ headers: {} });
    const promises: Promise<any>[] = [];
    await Promise.all(cmds.map(cmd => this.discovery.findDevice(cmd.device).connect()));
    cmds.forEach(cmd => {
      cmd.signals.forEach(signal => {
        promises.push(
          this.receiveCmdCase.execute({
            headers: {
              manualConnect: true,
              kind: signal.kind,
              value: signal.value,
              deviceNames: [cmd.device],
            },
          }),
        );
      });
    });

    await Promise.all(promises);
    return HttpResponse.success(204, null);
  }

  private processRawString(rawString: string) {
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
  };
}
