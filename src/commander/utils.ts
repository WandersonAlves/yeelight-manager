import { AxiosError, AxiosResponse } from 'axios';
import { IHttpRequest } from '../shared/contracts';
import { jsonString, logger } from '../shared/Logger';

export const ConfigureCmds = (logLevel?: 'verbose' | 'debug' | 'info') => {
  if (logLevel) {
    logger.level = logLevel;
  }
  if (!process.env.YEELIGHT_PORT || isNaN(Number(process.env.YEELIGHT_PORT))) {
    logger.warn(
      `YEELIGHT_PORT variable isn't valid, defaulting to 3500. Please put it on your .bash, .zshrc, PATH etc. (i.e: export YEELIGHT_PORT=3500)`,
    );
    return 3500;
  }
  return Number(process.env.YEELIGHT_PORT);
};

export const HandleRequest = async (fn: Promise<AxiosResponse<any>>) => {
  try {
    const { data } = await fn;
    logger.info(jsonString(data));
  } catch (e) {
    const error: AxiosError<IHttpRequest<any>> = e;
    const err = error?.response?.data ? jsonString(error.response?.data) : error.message;
    logger.error(err);
  }
};
