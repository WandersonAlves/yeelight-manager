/* eslint-disable no-bitwise */
import { logger } from "../shared/Logger";

export const GetValueFromString = (message: string, key: string, defaultValue?: any): string => {
  if (defaultValue === void 0) {
    defaultValue = "";
  }
  const regex = new RegExp(key + ": ([^\r\n]*)");
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const m = message.match(regex);
  if (m && m.length > 0) {
    return m[1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return defaultValue;
};

export const IntegerToRgb = (num: number): number[] =>{
  if (num < 0 || num > 16777215) {
    // RGB values are in the range [0, 255]
    throw new Error('Number out of RGB range');
  }

  const red = (num >> 16) & 255;
  const green = (num >> 8) & 255;
  const blue = num & 255;

  return [red, green, blue];
}

export const HexToInteger = (hex: string): number => {
  let copyHex = hex;
  if (copyHex.length === 3) {
    copyHex = copyHex
      .split('')
      .map(char => char + char)
      .join('');
  }

  const result = parseInt(copyHex, 16);
  logger.debug(`Hex color: #${hex} converted to number: ${result}`, { label: `HexToInteger` });
  return result;
};

export const FpsToMs = (fps: number): number => 1000 / fps;

export const GetListIpAddress = (currentIp: string, from = 1, to = 254): string[] =>  {
  const startNumber = parseInt(currentIp.split('.')[3], 10);
  const results: string[] = [];
  let before = startNumber;
  let after = startNumber;
  const sub = currentIp.substring(0, currentIp.lastIndexOf('.'));

  while (before > from || after < to) {
    before--;
    after++;
    if (before >= from && before > 0) {
      results.push(`${sub}.${before}`);
    }
    if (after <= to && after < 255) {
      results.push(`${sub}.${after}`);
    }
  }
  return results;
}