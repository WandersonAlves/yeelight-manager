import { CommandList } from '../../../infra/enums';

export interface CommandSignal {
  deviceid: string;
  kind: CommandList;
  name?: string;
  brightlevel?: number;
  hex?: string;
  ct?: number;
  ip?: string;
  power?: 'on' | 'off';
}
