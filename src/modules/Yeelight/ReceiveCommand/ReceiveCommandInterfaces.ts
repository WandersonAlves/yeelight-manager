import { CommandList } from "../../../infra/enums";
import Command from "../../../infra/yeelight/devices/Commands";

export interface ReceiveCommandCaseHeaders {
  deviceid: string;
  kind: CommandList;
  command: Command;
}
