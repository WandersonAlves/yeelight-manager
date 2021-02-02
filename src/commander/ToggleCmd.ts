import { ConfigureCmds } from './utils';
import { jsonString, logger } from '../shared/Logger';
import axios from 'axios';

interface OptionalParams {
  verbose: boolean;
  debug: boolean;
}
type ToggleCmdFn = (deviceid: string, { verbose, debug }: OptionalParams) => Promise<void>;

export const ToggleCmd: ToggleCmdFn = async (deviceid: string, { verbose, debug }) => {
  const port = ConfigureCmds(verbose ? 'verbose' : debug ? 'debug' : 'info');
  console.log(deviceid)
  const { data } = await axios.post(`http://localhost:${port}/yeelight/command`, null, {
    headers: {
      deviceId: deviceid,
      kind: 'toggle'
    },
  });
  logger.info(jsonString(data));
  return;
};
