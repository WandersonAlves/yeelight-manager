import { CommandList } from '../infra/enums';
import { ConfigureCmds } from '../shared/Logger';
import { GetBindingFromContainer } from '../infra/container';
import DiscoverDevicesCase from '../modules/Discovery/DiscoverDevices/DiscoverDevicesCase';
import ReceiveCommandCase from '../modules/Yeelight/ReceiveCommand/ReceiveCommandCase';

interface SendCommandOptionals {
  effect: 'sudden' | 'smooth';
  verbose?: boolean;
  debug?: boolean;
  duration: string;
}
type SendCommandFn = (
  devices: string,
  cmd: CommandList,
  value: string,
  bright: string,
  { effect, duration }: SendCommandOptionals,
) => Promise<void>;

export const SendCommandCmd: SendCommandFn = async (devices, cmd, value, bright, { verbose, debug }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  await GetBindingFromContainer(DiscoverDevicesCase).execute();
  await GetBindingFromContainer(ReceiveCommandCase).execute({
    deviceNames: devices.split(','),
    kind: cmd,
    value,
    bright,
  });
  process.exit();
};
