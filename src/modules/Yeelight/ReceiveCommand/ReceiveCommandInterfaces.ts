import { CommandList } from '../../../shared/enums';

export interface CommandSignal {
    kind: CommandList;
    value?: string;
    bright?: string;
}
