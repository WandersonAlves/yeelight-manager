import { CommandList } from '../../../infra/enums';

export interface CommandSignal {
  kind: CommandList;
  value?: string;
  bright?: string;
}
