import { GetBindingFromContainer } from '../infra/container';
import { LocalStorage } from 'node-localstorage';
import { logger } from '../shared/Logger';
import SetxCommandCase from '../modules/Yeelight/SetxCommand/SetxCommandCase';

export const LoadCommandCmd = async (name: string) => {
  const rawString = new LocalStorage('./localStorage').getItem(name);
  if (!rawString) {
    logger.error(`Command '${name}' not found`);
  }

  await GetBindingFromContainer(SetxCommandCase).execute({ body: rawString });
  process.exit();
};
