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

export const HexToInteger = (hex: string): number => {
  const hexString = hex.toUpperCase();
  let result = 0;
  for (let i = 1; i <= hexString.length; i++) {
    let valueNumber = hexString.charCodeAt(i - 1);
    valueNumber -= valueNumber >= 65 ? 55 : 48;
    result += valueNumber * Math.pow(16, hex.length - i);
  }
  return result;
};