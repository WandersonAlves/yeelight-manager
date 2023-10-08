import { ConfigureCmds, logger } from '../shared/Logger';
import { FpsToMs } from '../utils';
import { GetBindingFromContainer } from '../infra/container';
import AmbilightCmdCase from '../modules/Yeelight/Ambilight/AmbilightCmdCase';
import Screenshot from '../infra/screenshot/Screenshot';

export const AmbilightCmd = async (devices: string, value: string, interval = "300", { verbose, debug, luminance }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  const deviceNames = devices.split(',');
  const { width, height, x, y } = Screenshot.GetScreenAreaDimensions(value);
  const fetchColorsInterval = interval.includes("fps") ? FpsToMs(Number(interval.split("fps")[0])) : Number(interval);

  logger.debug(`Interval MS: ${fetchColorsInterval}; Raw interval: ${interval}`, { label: 'AmbilightCmd' });

  await GetBindingFromContainer(AmbilightCmdCase).execute({
    deviceNames,
    height,
    width,
    x,
    y,
    interval: fetchColorsInterval,
    useLuminance: luminance,
  });
  process.exit();
};
