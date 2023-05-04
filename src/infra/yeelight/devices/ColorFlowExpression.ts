import { ColorFlowExpressionMode } from "../../enums";

export default class ColorFlowExpression {
  constructor(
    private duration: number,
    private mode: ColorFlowExpressionMode,
    private value: number,
    private bright: number
  ) {
    if (this.mode === ColorFlowExpressionMode.TEMPERATURE) {
      this.value = value < 1700 ? 1700 : value > 6500 ? 6500 : value;
    }
    this.bright = bright < 1 ? 1 : bright > 100 ? 100 : bright;
  }

  toString() {
    return `${this.duration},${this.mode},${this.value},${this.bright}`;
  }
}
