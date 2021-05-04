import { ConfigureCmds } from './utils';
import { GetBindingFromContainer } from '../infra/container';
import { logger } from '../shared/Logger';
import { unlinkSync } from 'fs';
import DiscoverDevicesCase from '../modules/Discovery/DiscoverDevices/DiscoverDevicesCase';
import server from '../server';

export const DiscoverDevicesCmd = async ({ verbose, debug, waitTime }) => {
  try {
    unlinkSync('log.log');
  }
  finally {
    const port = ConfigureCmds(debug ? 'debug' : verbose ? 'verbose' : 'info');
    const cmdCase = GetBindingFromContainer(DiscoverDevicesCase);
    await cmdCase.execute({ headers: { waitTime }});
    server.listen(port, () => {
      logger.info(`yeelight-manager aka yee listening on ${port}`);
      logger.info('You can use yee CLI or use HTTP requests to control your lights');
    });
  }
};
