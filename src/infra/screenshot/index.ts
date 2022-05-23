import { execSync } from 'child_process';
import { logger } from '../../shared/Logger';
import pathToFfmpeg from 'ffmpeg-static';
import tinycolor from 'tinycolor2';
import vibrant from 'node-vibrant';

export default class Screenshot {
  static GetProeminentColor(width: number, height: number): Promise<{ color: string; bright: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        execSync(
          [
            pathToFfmpeg,
            '-y',
            '-video_size',
            `${width}x${height}`,
            '-f',
            'x11grab',
            '-i',
            ':1',
            '-vf',
            `scale=${width / 2}:-1`,
            '-frames:v',
            '1',
            '-preset',
            'ultrafast',
            '-progress',
            'pipe:1',
            `${width}x${height}.jpg`,
          ].join(' '),
          { stdio: 'ignore' },
        );
        const { DarkMuted, DarkVibrant, LightMuted, LightVibrant, Muted, Vibrant } = await new vibrant(`${width}x${height}.jpg`).getPalette();
        const { hex } = [DarkMuted, DarkVibrant, LightVibrant, LightMuted, Muted, Vibrant].sort(
          (a, b) => b.population - a.population,
        )[0];
        const bright = ((tinycolor(hex).getBrightness() / 255) * 100).toFixed();
        logger.debug(`ffmpeg proeminent color: ${hex} | brightness: ${bright}`);
        resolve({ color: hex.replace('#', ''), bright });
      } catch (e) {
        reject(e);
      }
    });
  }
}
