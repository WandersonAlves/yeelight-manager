import { CommandList } from '../../../infra/enums';

export interface CommandSignal {
  deviceid: string;
  kind: CommandList;
  value?: string;
  bright?: string;
}
