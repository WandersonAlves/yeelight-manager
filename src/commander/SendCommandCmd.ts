import { CommandList } from '../infra/enums';
import { ConfigureCmds } from './utils';
import { jsonString, logger } from '../shared/Logger';
import HttpResponse from '../shared/responses/HttpResponse';
import axios from 'axios';

interface SendCommandOptionals {
  verbose: boolean;
  debug: boolean;
  effect: 'sudden' | 'smooth';
  duration: string;
}
type SendCommandFn = (
  deviceid: string,
  cmd: CommandList,
  value: string,
  { verbose, effect, duration }: SendCommandOptionals,
) => Promise<void>;

export const SendCommandCmd: SendCommandFn = async (deviceid, cmd, value, { verbose, debug }) => {
  const port = ConfigureCmds(verbose ? 'verbose' : debug ? 'debug' : 'info');
  const { data } = await axios.post<HttpResponse<any>>(`http://localhost:${port}/yeelight/command`, null, {
    headers: {
      deviceId: deviceid,
      kind: cmd,
      value,
    },
  });
  logger.info(jsonString(data));
  return;
};
