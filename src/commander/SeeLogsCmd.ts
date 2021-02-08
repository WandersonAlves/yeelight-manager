import { Tail } from 'tail';
import { readFileSync } from 'fs';

export const SeeLogsCmd = () => {
  const tail = new Tail(`log.log`);
  const file = readFileSync('log.log');
  console.log(file.toString());
  tail.on('line', d => {
    console.log(d);
  });
};
