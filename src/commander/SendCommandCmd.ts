import { CommandList } from '../infra/enums';
import { ConfigureCmds } from './utils';
import { execSync } from 'child_process';

interface SendCommandOptionals {
  verbose: boolean;
  debug: boolean;
  effect: 'sudden' | 'smooth';
  duration: string;
}
type SendCommandFn = (
  deviceid: string,
  cmd: CommandList,
  value: string,
  { verbose, effect, duration }: SendCommandOptionals,
) => Promise<void>;

export const SendCommandCmd: SendCommandFn = async (deviceid, cmd, value, { verbose, debug }) => {
  const port = ConfigureCmds(verbose ? 'verbose' : debug ? 'debug' : 'info');
  execSync(
    `curl --location --request POST 'localhost:${port}/yeelight/command' \
      --header 'deviceId: ${deviceid}' \
      --header 'kind: ${cmd}' \
      --header 'value: ${value}'`,
    { stdio: 'ignore' },
  );

  return;
};
