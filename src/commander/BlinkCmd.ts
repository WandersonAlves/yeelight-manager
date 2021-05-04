import { CommandList } from "../infra/enums";
import { ConfigureCmds } from "./utils";
import { GetBindingFromContainer } from "../infra/container";
import DiscoverDevicesCase from "../modules/Discovery/DiscoverDevices/DiscoverDevicesCase";
import ReceiveCommandCase from "../modules/Yeelight/ReceiveCommand/ReceiveCommandCase";

export const BlinkCmd = async (deviceid: string, { verbose, debug, waitTime }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  await GetBindingFromContainer(DiscoverDevicesCase).execute({ headers: { waitTime } });
  await GetBindingFromContainer(ReceiveCommandCase).execute({
    headers: {
      deviceid,
      kind: CommandList.BLINK,
    },
  });
  process.exit(0);
};