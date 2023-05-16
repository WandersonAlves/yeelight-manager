import { getDominantColorCallback } from '../../../infra/screenshot';
import Screenshot from '../../../infra/screenshot/Screenshot';

interface WorkerParams {
  x: number;
  y: number;
  width: number;
  height: number;
  interval: number;
}

const Worker = (params: WorkerParams) => {
  getDominantColorCallback(params.x, params.y, params.width, params.height, params.interval, (colors: string[]) => {
    try {
      process.stdout.write(JSON.stringify(Screenshot.ProcessPredominantColor(colors)));
      return null;
    }
    catch (e) { return null }
  });
};

const [x, y, width, height, interval] = process.argv.slice(2).map(i => Number(i));

Worker({ x, y, width, height, interval });
