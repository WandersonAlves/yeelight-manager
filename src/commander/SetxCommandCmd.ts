import { ConfigureCmds } from '../shared/Logger';
import { GetBindingFromContainer } from '../infra/container';
import { jsonString, logger } from '../shared/Logger';
import CommandStorage from '../infra/storage/CommandStorage';
import GenericException from '../shared/exceptions/GenericException';
import SetxCommandCase from '../modules/Yeelight/SetxCommand/SetxCommandCase';

interface SetxCommandOptionals {
  verbose?: boolean;
  debug?: boolean;
  save?: string;
  exec?: boolean;
}

type SetxCommandFn = (rawString: string, opts: SetxCommandOptionals) => Promise<void>;

export const SetxCommandCmd: SetxCommandFn = async (rawString, opts) => {
  const { debug, verbose, save } = opts;
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  logger.verbose(`Received parameters: ${jsonString(opts)}`, { label: 'SetxCommandCmd' });
  const result: any = await GetBindingFromContainer(SetxCommandCase).execute(rawString);
  if (save && !(result instanceof GenericException)) {
    CommandStorage.save(save, rawString);
    logger.info(`New command saved as "${save}"`, { label: 'SetxCommandCmd' });
  }
  process.exit();
};
