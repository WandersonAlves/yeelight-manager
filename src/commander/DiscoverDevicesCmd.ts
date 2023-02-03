import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import { unlinkSync } from 'fs';
import DiscoverDevicesCase from '../modules/Discovery/DiscoverDevices/DiscoverDevicesCase';

export const DiscoverDevicesCmd = async ({ verbose, debug, waitTime }) => {
  try {
    unlinkSync('log.log');
  }
  finally {
    ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
    const discoveryCase = GetBindingFromContainer(DiscoverDevicesCase);
    await discoveryCase.execute({ waitTime });
  }
};
