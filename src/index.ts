import 'reflect-metadata';
import { logger } from './shared/Logger';
import server from './server';



server.listen(3000, () => {
  logger.info('yeelight-manager-backend listening on 3000');
});

// export const handler = (event: APIGatewayEvent, context: Context) => {
//   proxy(createServer(server), event, context);
// };
