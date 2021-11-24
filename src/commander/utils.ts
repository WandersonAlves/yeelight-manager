import { logger } from '../shared/Logger';

export const ConfigureCmds = (logLevel?: 'verbose' | 'debug' | 'info') => {
  logger.level = logLevel;
};

