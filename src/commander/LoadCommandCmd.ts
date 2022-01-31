import { GetBindingFromContainer } from '../infra/container';
import { logger } from '../shared/Logger';
import CommandStorage from '../infra/storage/CommandStorage';
import SetxCommandCase from '../modules/Yeelight/SetxCommand/SetxCommandCase';

export const LoadCommandCmd = async (name: string) => {
  const rawString = CommandStorage.load(name);
  if (!rawString) {
    logger.error(`Command '${name}' not found`);
  }

  await GetBindingFromContainer(SetxCommandCase).execute({ body: rawString });
  process.exit();
};
