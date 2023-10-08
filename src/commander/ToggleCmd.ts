import { CommandList } from '../infra/enums';
import { ConfigureCmds } from '../shared/Logger';
import { GetBindingFromContainer } from '../infra/container';
import DiscoverDevicesCase from '../modules/Discovery/DiscoverDevices/DiscoverDevicesCase';
import ReceiveCommandCase from '../modules/Yeelight/ReceiveCommand/ReceiveCommandCase';

export const ToggleCmd = async (devices: string, { verbose, debug, waitTime }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  await GetBindingFromContainer(DiscoverDevicesCase).execute({ waitTime });
  await GetBindingFromContainer(ReceiveCommandCase).execute({
    deviceNames: devices.split(','),
    kind: CommandList.TOGGLE,
  });
  process.exit(0);
};
