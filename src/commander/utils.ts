import { logger } from "../shared/Logger";

export const ConfigureCmds = (logLevel: 'verbose' | 'debug' | 'info') => {
  logger.level = logLevel;
  if (!process.env.YEELIGHT_PORT || isNaN(Number(process.env.YEELIGHT_PORT))) {
    logger.warn(
      `YEELIGHT_PORT variable isn't valid, defaulting to 3500. Please put it on your .bash, .zshrc, PATH etc. (i.e: export YEELIGHT_PORT=3500)`,
    );
    return 3500;
  }
  return process.env.YEELIGHT_PORT
}