import { ConfigureCmds, jsonString, logger } from '../shared/Logger';
import { GetBindingFromContainer } from '../infra/container';
import ColorStorage from '../infra/storage/ColorStorage';
import DiscoverDevicesCase from '../modules/Discovery/DiscoverDevices/DiscoverDevicesCase';

export const ListCmd = async ({ verbose, debug, waitTime, colors }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  if (colors) {
    logger.info('List of available colors:');
    logger.info(`${jsonString(ColorStorage.Colors)}`);
    process.exit(0);
  }
  await GetBindingFromContainer(DiscoverDevicesCase).execute({ waitTime, logDevices: true });
  process.exit(0);
};
