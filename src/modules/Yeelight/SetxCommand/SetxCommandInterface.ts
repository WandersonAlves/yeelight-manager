import { CommandSignal } from "../ReceiveCommand/ReceiveCommandInterfaces";

export interface DeviceCmd {
  device: string;
  signals?: CommandSignal[];
}