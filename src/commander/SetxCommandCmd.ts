import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import { logger } from '../shared/Logger';
import CommandStorage from '../infra/storage/CommandStorage';
import GenericException from '../shared/exceptions/GenericException';
import SetxCommandCase from '../modules/Yeelight/SetxCommand/SetxCommandCase';

interface SetxCommandOptionals {
  verbose?: boolean;
  debug?: boolean;
  save?: string;
}

type SetxCommandFn = (rawString: string, opts: SetxCommandOptionals) => Promise<void>;

export const SetxCommandCmd: SetxCommandFn = async (rawString, { debug, verbose, save }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');

  const result: any = await GetBindingFromContainer(SetxCommandCase).execute(rawString);
  if (save && result instanceof GenericException) {
    CommandStorage.save(save, rawString);
    logger.info(`New command saved as "${save}"`);
  }
  process.exit();
};
