import { ContainerModule } from 'inversify';
import DiscoverDevicesCase from './DiscoverDevices/DiscoverDevicesCase';
import ListDevicesCase from './ListDevices/ListDevicesCase';

const DiscoveryContainer = new ContainerModule((bind) => {
    bind<DiscoverDevicesCase>(DiscoverDevicesCase).toSelf();
    bind<ListDevicesCase>(ListDevicesCase).toSelf();
});

export default DiscoveryContainer;
