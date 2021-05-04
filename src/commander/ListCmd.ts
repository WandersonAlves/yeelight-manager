import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import DiscoverDevicesCase from '../modules/Discovery/DiscoverDevices/DiscoverDevicesCase';

export const ListCmd = async ({ verbose, debug, waitTime }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  await GetBindingFromContainer(DiscoverDevicesCase).execute({ headers: { waitTime } });
  process.exit(0);
};
