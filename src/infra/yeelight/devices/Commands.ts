/* eslint-disable max-classes-per-file */
import { ColorFlowAction } from '../../enums';
import ColorFlowExpression from './Flow';

export type EffectTypes = 'smooth' | 'sudden';

export default class Command {
  constructor(private id: number, private command: string, private params: any[]) {}

  toString() {
    return JSON.stringify(this) + '\r\n';
  }

  get name() {
    return this.command;
  }
}

export class NameCommand extends Command {
  constructor(name: string, id = 1) {
    super(id, 'set_name', [name]);
  }
}
export class RGBCommand extends Command {
  constructor(rgbInteger: number, effect: EffectTypes = 'smooth', duration = 300, id = 1) {
    super(id, 'set_rgb', [rgbInteger, effect, duration ?? 300]);
  }
}

export class MusicModeCommand extends Command {
  constructor(toggle: boolean, localIpAddress: string, tcpServerPort: number) {
    super(9999, 'set_music', [toggle ? 1 : 0, localIpAddress, tcpServerPort]);
  }
}

export class ToggleCommand extends Command {
  constructor(id = 1) {
    super(id, 'toggle', []);
  }
}

export class BrightCommand extends Command {
  constructor(value: number, effect: EffectTypes = 'smooth', duration = 300, id = 1) {
    super(id, 'set_bright', [value < 1 ? 1 : value > 100 ? 100 : Number(value), effect, duration]);
  }
}

export class ColorTemperatureCommand extends Command {
  constructor(value: number, effect: EffectTypes = 'smooth', duration = 300, id = 1) {
    super(id, 'set_ct_abx', [value < 1700 ? 1700 : value > 6500 ? 6500 : value, effect, duration]);
  }
}

export class ColorFlowCommand extends Command {
  constructor(repeat: number, action: ColorFlowAction, flows: ColorFlowExpression[], id = 1) {
    super(id, 'start_cf', [repeat, action, flows.join(',')]);
  }
}

export class PowerCommand extends Command {
  constructor(power: 'on' | 'off', effect: EffectTypes = 'smooth', duration = 300, id = 9999) {
    super(id, 'set_power', [power, effect, duration]);
  }
}
