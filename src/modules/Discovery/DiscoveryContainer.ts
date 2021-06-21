import { ContainerModule } from 'inversify';
import DiscoverDevicesCase from './DiscoverDevices/DiscoverDevicesCase';
import RetrieveDeviceCase from './RetrieveDevice/RetrieveDeviceCase';

const DiscoveryContainer = new ContainerModule(bind => {
  bind<DiscoverDevicesCase>(DiscoverDevicesCase).toSelf();
  bind<RetrieveDeviceCase>(RetrieveDeviceCase).toSelf();
});

export default DiscoveryContainer;
