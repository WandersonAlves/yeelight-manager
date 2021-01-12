import { ContainerModule } from 'inversify';
import DiscoverDevicesCase from './DiscoverDevices/DiscoverDevicesCase';
import DiscoverDevicesRouter from './DiscoverDevices/DiscoverDevicesRouter';
import RetrieveDeviceCase from './RetrieveDevice/RetrieveDeviceCase';
import RetrieveDeviceRouter from './RetrieveDevice/RetrieveDeviceRouter';

const DiscoveryContainer = new ContainerModule(bind => {
  bind<DiscoverDevicesCase>(DiscoverDevicesCase).toSelf();
  bind<DiscoverDevicesRouter>(DiscoverDevicesRouter).toSelf();
  bind<RetrieveDeviceRouter>(RetrieveDeviceRouter).toSelf();
  bind<RetrieveDeviceCase>(RetrieveDeviceCase).toSelf();
});

export default DiscoveryContainer;
