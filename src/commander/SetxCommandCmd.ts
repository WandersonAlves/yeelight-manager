import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import { LocalStorage } from 'node-localstorage';
import { logger } from '../shared/Logger';
import SetxCommandCase from '../modules/Yeelight/SetxCommand/SetxCommandCase';

interface SetxCommandOptionals {
  verbose?: boolean;
  debug?: boolean;
  save?: string
}

type SetxCommandFn = (rawString: string, opts: SetxCommandOptionals) => Promise<void>;

export const SetxCommandCmd: SetxCommandFn = async (rawString, { debug, verbose, save }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');

  if (save) {
    new LocalStorage('./localStorage').setItem(save, rawString);
    logger.info(`New command saved as "${save}"`);
    return process.exit();
  }

  await GetBindingFromContainer(SetxCommandCase).execute({ body: rawString });

  process.exit();
};
