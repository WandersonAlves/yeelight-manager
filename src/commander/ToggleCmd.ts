import { ConfigureCmds, HandleRequest } from './utils';
import HttpResponse from '../shared/responses/HttpResponse';
import axios from 'axios';

interface OptionalParams {
  verbose: boolean;
  debug: boolean;
}
type ToggleCmdFn = (deviceid: string, { verbose, debug }: OptionalParams) => Promise<void>;

export const ToggleCmd: ToggleCmdFn = async (deviceid: string, { verbose, debug }) => {
  const port = ConfigureCmds(verbose ? 'verbose' : debug ? 'debug' : 'info');
  void HandleRequest(
    axios.post<HttpResponse<any>>(`http://localhost:${port}/yeelight/command`, null, {
      headers: {
        deviceId: deviceid,
        kind: 'toggle',
      },
    }),
  );
  return;
};
