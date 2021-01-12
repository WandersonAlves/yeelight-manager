import { GetBindingFromContainer } from '../../infra/container';
import { Router } from 'express';
import DiscoverDevicesRouter from './DiscoverDevices/DiscoverDevicesRouter';
import ExpressRouterAdapter from '../../shared/adapters/ExpressRouterAdapter';
import RetrieveDeviceRouter from './RetrieveDevice/RetrieveDeviceRouter';

const DiscoveryRoutes = Router();

DiscoveryRoutes.get('/devices', ExpressRouterAdapter.adapt(GetBindingFromContainer(DiscoverDevicesRouter)));
DiscoveryRoutes.get('/retrieve-device', ExpressRouterAdapter.adapt(GetBindingFromContainer(RetrieveDeviceRouter)));

export default DiscoveryRoutes;
