import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as expressWinston from 'express-winston';
import { logger } from '../shared/Logger';
import DiscoveryRoutes from '../modules/Discovery/DiscoveryRoutes';
import ExpressRouteNotFoundAdapter from '../shared/adapters/ExpressRouteNotFoundAdapter';

const server = express();

server.use(expressWinston.logger(logger));
server.use(bodyParser.json());

server.use('/discovery', DiscoveryRoutes);

server.use(ExpressRouteNotFoundAdapter.adapt());

export default server;
