import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import { logger } from '../shared/Logger';
import CommandStorage from '../infra/storage/CommandStorage';
import SetxCommandCase from '../modules/Yeelight/SetxCommand/SetxCommandCase';

interface SetxCommandOptionals {
  verbose?: boolean;
  debug?: boolean;
  save?: string;
}

type SetxCommandFn = (rawString: string, opts: SetxCommandOptionals) => Promise<void>;

export const SetxCommandCmd: SetxCommandFn = async (rawString, { debug, verbose, save }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');

  if (save) {
    CommandStorage.save(save, rawString);
    logger.info(`New command saved as "${save}"`);
    return process.exit();
  }

  await GetBindingFromContainer(SetxCommandCase).execute({ body: rawString });

  process.exit();
};
