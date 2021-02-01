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
  CT = 'color-temperature',
  BRIGHT = 'bright',
  NAME = 'name',
  AMBILIGHT = 'ambilight',
  CANCEL_AMBILIGHT = 'cancel_ambilight',
  BLINK = 'blink',
  POWER = 'power'
}