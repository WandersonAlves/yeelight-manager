import * as bodyParser from 'body-parser';
import DiscoveryRoutes from '../modules/Discovery/DiscoveryRoutes';
import ExpressRouteNotFoundAdapter from '../shared/adapters/ExpressRouteNotFoundAdapter';
import YeelightRoutes from '../modules/Yeelight/YeelightRoutes';
import express from 'express';

const server = express();

server.use(bodyParser.json());

server.use('/discovery', DiscoveryRoutes);
server.use('/yeelight', YeelightRoutes);

server.use(ExpressRouteNotFoundAdapter.adapt());

export default server;
