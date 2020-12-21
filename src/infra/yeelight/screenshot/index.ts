import { execSync } from 'child_process';
import pathToFfmpeg from 'ffmpeg-static';
import vibrant from 'node-vibrant';

export default class Screenshot {
  static GetProeminentColor(width: number, height: number): Promise<string> {
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
            ':0.0',
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
        const result = await new vibrant(`${width}x${height}.jpg`).getPalette();
        const { DarkMuted, DarkVibrant, LightMuted, LightVibrant, Muted, Vibrant } = result;
        const { hex } = [DarkMuted, DarkVibrant, LightVibrant, LightMuted, Muted, Vibrant].sort(
          (a, b) => b.population - a.population,
        )[0];
        resolve(hex.replace('#', ''));
      } catch (e) {
        reject(e);
      }
    });
  }
}
