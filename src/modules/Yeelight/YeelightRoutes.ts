import { GetBindingFromContainer } from '../../infra/container';
import { Router } from 'express';

import ExpressRouterAdapter from '../../shared/adapters/ExpressRouterAdapter';
import ReceiveCommandRouter from './ReceiveCommand/ReceiveCommandRouter';
import RunSceneRouter from './RunScene/RunSceneRouter';

const YeelightRoutes = Router();

YeelightRoutes.post('/command', ExpressRouterAdapter.adapt(GetBindingFromContainer(ReceiveCommandRouter)));
YeelightRoutes.post('/scene', ExpressRouterAdapter.adapt(GetBindingFromContainer(RunSceneRouter)));

export default YeelightRoutes;
