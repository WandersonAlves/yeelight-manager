import { ContainerModule } from 'inversify';
import DiscoverDevicesCase from './DiscoverDevices/DiscoverDevicesCase';
import DiscoverDevicesRouter from './DiscoverDevices/DiscoverDevicesRouter';

const DiscoveryContainer = new ContainerModule(bind => {
  bind<DiscoverDevicesCase>(DiscoverDevicesCase).toSelf();
  bind<DiscoverDevicesRouter>(DiscoverDevicesRouter).toSelf();
});

export default DiscoveryContainer;
