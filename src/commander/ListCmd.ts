import { ConfigureCmds, logger } from '../shared/Logger';
import { GetBindingFromContainer } from '../infra/container';
import ColorStorage from '../infra/storage/ColorStorage';
import CommandStorage from '../infra/storage/CommandStorage';
import DiscoverDevicesCase from '../modules/Discovery/DiscoverDevices/DiscoverDevicesCase';
import chalk from 'chalk';

export const ListCmd = async ({ verbose, debug, waitTime, colors }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  if (colors) {
    logger.info('List of available colors:');
    Object.entries(ColorStorage.Colors).forEach(([colorName, colorCode]) =>
      logger.info(`${colorName}: ${chalk.hex(colorCode)`${colorCode}`}`),
    );
    process.exit(0);
  }
  await GetBindingFromContainer(DiscoverDevicesCase).execute({ waitTime, logDevices: true });
  CommandStorage.getAll();
  process.exit(0);
};
