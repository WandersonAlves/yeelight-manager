import { DominantColorResponse, getDominantColorCallback } from '../../../infra/screenshot';

interface WorkerParams {
  x: number;
  y: number;
  width: number;
  height: number;
  interval: number;
}

const Worker = (params: WorkerParams) => {
  getDominantColorCallback(
    params.x,
    params.y,
    params.width,
    params.height,
    params.interval,
    (response: DominantColorResponse) => {
      try {
        process.stdout.write(JSON.stringify(response));
        return null;
      } catch (e) {
        return null;
      }
    },
  );
};

const [x, y, width, height, interval] = process.argv.slice(2).map(i => Number(i));

Worker({ x, y, width, height, interval });
