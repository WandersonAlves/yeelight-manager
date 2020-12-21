import { GetBindingFromContainer } from '../../infra/container';
import { Router } from 'express';

import ExpressRouterAdapter from '../../shared/adapters/ExpressRouterAdapter';
import ReceiveCommandRouter from './ReceiveCommand/ReceiveCommandRouter';

const YeelightRoutes = Router();

YeelightRoutes.post('/command', ExpressRouterAdapter.adapt(GetBindingFromContainer(ReceiveCommandRouter)));

export default YeelightRoutes;
