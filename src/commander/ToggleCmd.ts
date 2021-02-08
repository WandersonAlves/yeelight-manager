import { ConfigureCmds, HandleRequest } from './utils';
import HttpResponse from '../shared/responses/HttpResponse';
import axios from 'axios';

type ToggleCmdFn = (deviceid: string) => Promise<void>;

export const ToggleCmd: ToggleCmdFn = async (deviceid: string) => {
  const port = ConfigureCmds();
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
