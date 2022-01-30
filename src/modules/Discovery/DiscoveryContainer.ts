import { ContainerModule } from 'inversify';
import DiscoverDevicesCase from './DiscoverDevices/DiscoverDevicesCase';

const DiscoveryContainer = new ContainerModule(bind => {
  bind<DiscoverDevicesCase>(DiscoverDevicesCase).toSelf();
});

export default DiscoveryContainer;
