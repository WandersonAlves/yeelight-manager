import { GetBindingFromContainer } from "../../infra/container";
import { logger } from "../../shared/Logger";
import DiscoverDevicesCase from "../../modules/Discovery/DiscoverDevices/DiscoverDevicesCase";
import server from "../../server";

export const DiscoverDevicesCmd = async ({ verbose }) => {
  logger.level = verbose ? 'debug' : 'info';
  const port = process.env.YEELIGHT_PORT;
  const cmdCase = GetBindingFromContainer(DiscoverDevicesCase);
  await cmdCase.execute();
  server.listen(port, () => {
    logger.info(`yeelight-manager-backend listening on ${port}`);
  });
  return;
};
