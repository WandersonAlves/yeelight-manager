import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import { logger } from '../shared/Logger';
import CommandStorage from '../infra/storage/CommandStorage';
import SetxCommandCase from '../modules/Yeelight/SetxCommand/SetxCommandCase';

export const LoadCommandCmd = async (name: string, { list, verbose, debug }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  if (list) {
    CommandStorage.getAll();
    process.exit();
  } else if (!name) {
    logger.error('A name is required to load');
    process.exit();
  }
  const rawString = CommandStorage.load(name);
  if (!rawString) {
    logger.error(`Command '${name}' not found`);
    process.exit();
  }

  await GetBindingFromContainer(SetxCommandCase).execute(rawString);
  process.exit();
};
