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