import { GetBindingFromContainer } from '../../infra/container';
import { Router } from 'express';
import DiscoverDevicesRouter from './DiscoverDevices/DiscoverDevicesRouter';
import ExpressRouterAdapter from '../../shared/adapters/ExpressRouterAdapter';

const DiscoveryRoutes = Router();

DiscoveryRoutes.get('/devices', ExpressRouterAdapter.adapt(GetBindingFromContainer(DiscoverDevicesRouter)));

export default DiscoveryRoutes;
