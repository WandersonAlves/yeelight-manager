import { CommandList } from '../../infra/enums';
import { execSync } from 'child_process';
import { logger } from '../../shared/Logger';

interface SendCommandOptionals {
  verbose: string;
  effect: 'sudden' | 'smooth';
  duration: string;
}
type SendCommandFn = (
  deviceid: string,
  cmd: CommandList,
  value: string,
  { verbose, effect, duration }: SendCommandOptionals,
) => Promise<void>;

export const SendCommandCmd: SendCommandFn = async (deviceid, cmd, value, { verbose }) => {
  logger.level = verbose ? 'verbose' : 'info';
  execSync(
    `curl --location --request POST 'localhost:${process.env.YEELIGHT_PORT}/yeelight/command' \
      --header 'deviceId: ${deviceid}' \
      --header 'kind: ${cmd}' \
      --header 'value: ${value}'`,
    { stdio: 'ignore' },
  );

  return;
};
