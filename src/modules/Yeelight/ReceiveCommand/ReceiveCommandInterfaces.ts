import { CommandList } from '../../../infra/enums';

export interface ReceiveCommandCaseHeaders {
  deviceid: string;
  kind: CommandList;
  name?: string;
  brightLevel?: number;
  hex?: string;
  ip?: string;
}
