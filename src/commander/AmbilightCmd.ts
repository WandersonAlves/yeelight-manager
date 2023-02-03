import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import AmbilightCase from '../modules/Yeelight/Ambilight/AmbilightCase';

export const AmbilightCmd = async (devices: string, resolution: string, interval: string, { verbose, debug }) => {
  ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
  const deviceNames = devices.split(',');
  const [width, height] = resolution.split('x').map(v => Number(v));

  await GetBindingFromContainer(AmbilightCase).execute({
    deviceNames,
    height,
    width,
    interval: Number(interval),
  });
  process.exit();
};
