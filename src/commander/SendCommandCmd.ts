import { CommandList } from '../infra/enums';
import { ConfigureCmds } from './utils';
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
  deviceid: string,
  cmd: CommandList,
  value: string,
  bright: string,
  { effect, duration }: SendCommandOptionals,
) => Promise<void>;

export const SendCommandCmd: SendCommandFn = async (deviceid, cmd, value, bright, { verbose, debug }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  const headers = {
    deviceid,
    kind: cmd,
    value,
    bright,
  };
  await GetBindingFromContainer(DiscoverDevicesCase).execute({ headers: {} });
  await GetBindingFromContainer(ReceiveCommandCase).execute({ headers });
  process.exit();
};
