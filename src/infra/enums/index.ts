/* eslint-disable no-shadow */
export enum ColorFlowExpressionMode {
  COLOR = 1,
  TEMPERATURE = 2,
  SLEEP = 7,
}

export enum ColorFlowAction {
  RECOVER_STATE = 0,
  STAY = 1,
  TURN_OFF = 2
}

export enum CommandList {
  TOGGLE = 'toggle',
  COLOR = 'color',
  CT = 'temperature',
  CT2 = 'ct',
  CT3 = 'temp',
  BRIGHT = 'bright',
  NAME = 'name',
  BLINK = 'blink',
  POWER = 'power',
  FLOW = 'flow'
}

export const CommandListArr = Object.entries(CommandList).map(n => n[1]);