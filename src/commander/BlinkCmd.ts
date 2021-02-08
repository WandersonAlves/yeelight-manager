import { ConfigureCmds, HandleRequest } from "./utils";
import HttpResponse from "../shared/responses/HttpResponse";
import axios from "axios";

export const BlinkCmd = (deviceid: string) => {
  const port = ConfigureCmds();
  void HandleRequest(
    axios.post<HttpResponse<any>>(`http://localhost:${port}/yeelight/command`, null, {
      headers: {
        deviceId: deviceid,
        kind: 'blink',
      },
    }),
  );
  return;
}