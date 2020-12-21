import 'reflect-metadata';
import { GetBindingFromContainer } from './infra/container';
import { logger } from './shared/Logger';
import Discovery from './infra/yeelight/discovery';
import server from './server';

void (async () => {
  const discovery = GetBindingFromContainer(Discovery);
  await discovery.discoverDevices();
  server.listen(3000, () => {
    logger.info('yeelight-manager-backend listening on 3000');
  });
})();
