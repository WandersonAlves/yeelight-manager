import { ConfigureCmds } from '../shared/Logger';
import { GetBindingFromContainer } from '../infra/container';
import AmbilightCase from '../modules/Yeelight/Ambilight/AmbilightCase';

export const AmbilightCmd = async (devices: string, resolution: string, interval = "300", { verbose, debug }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  const deviceNames = devices.split(',');
  const [width, height, x, y] = resolution.split('x').map(v => Number(v));

  await GetBindingFromContainer(AmbilightCase).execute({
    deviceNames,
    height,
    width,
    x,
    y,
    interval: Number(interval),
  });
  process.exit();
};
