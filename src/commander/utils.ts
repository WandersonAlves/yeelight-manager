import { AxiosError, AxiosResponse } from 'axios';
import { IHttpRequest } from '../shared/contracts';
import { jsonString, logger } from '../shared/Logger';

export const ConfigureCmds = (logLevel?: 'verbose' | 'debug' | 'info') => {
  logger.level = logLevel;
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
