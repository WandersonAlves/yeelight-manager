import { CommandList } from '../infra/enums';
import { ConfigureCmds, HandleRequest } from './utils';
import HttpResponse from '../shared/responses/HttpResponse';
import axios from 'axios';

interface SendCommandOptionals {
  effect: 'sudden' | 'smooth';
  duration: string;
}
type SendCommandFn = (
  deviceid: string,
  cmd: CommandList,
  value: string,
  bright: string,
  { effect, duration }: SendCommandOptionals,
) => Promise<void>;

export const SendCommandCmd: SendCommandFn = async (deviceid, cmd, value, bright) => {
  const port = ConfigureCmds();
  const headers = {
    deviceId: deviceid,
    kind: cmd,
    value,
    bright,
  };
  if (!bright) {
    Reflect.deleteProperty(headers, 'bright');
  }
  void HandleRequest(
    axios.post<HttpResponse<any>>(`http://localhost:${port}/yeelight/command`, null, { headers }),
  );
  return;
};
