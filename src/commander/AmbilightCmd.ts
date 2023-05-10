import { ConfigureCmds, logger } from '../shared/Logger';
import { FpsToMs } from '../utils';
import { GetBindingFromContainer } from '../infra/container';
import AmbilightCase from '../modules/Yeelight/Ambilight/AmbilightCase';

export const AmbilightCmd = async (devices: string, resolution: string, interval = "300", { verbose, debug }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  const deviceNames = devices.split(',');
  const [width, height, x, y] = resolution.split('x').map(v => Number(v));
  const fetchColorsInterval = interval.includes("fps") ? FpsToMs(Number(interval.split("fps")[0])) : Number(interval);

  logger.debug(`Interval MS: ${fetchColorsInterval}; Raw interval: ${interval}`, { label: 'AmbilightCmd' });

  await GetBindingFromContainer(AmbilightCase).execute({
    deviceNames,
    height,
    width,
    x,
    y,
    interval: fetchColorsInterval,
  });
  process.exit();
};
