import { FileType, Region, screen } from '@nut-tree/nut-js';
import { logger } from '../../shared/Logger';

interface FetchPredominantColorResult {
  color: string;
  luminance: number;
}

export default class Screenshot {
  private static RgbToHex = (rgb: number[]): string => {
    // eslint-disable-next-line no-bitwise
    return ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
  };

  private static GetColorLuminance = (rgb: number[]) => (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) * 255;

  static FetchPredominantColor = async (x: number, y: number, width: number, height: number): Promise<FetchPredominantColorResult> => {
    const region = new Region(x, y, width, height);
    const image = await screen.grabRegion(region);

    // TODO Check captured region
    // const png = new PNG({ filterType: 4 });
    // png.parse(image.data);
    // png.pack().pipe(fs.createWriteStream('image.png'));
    await screen.captureRegion('test', region, FileType.PNG);

    // Extract all pixels in the region
    const pixelData = image.data;
    const pixels: number[][] = [];
    for (let i = 0; i < pixelData.length; i += 4) {
      pixels.push([pixelData[i], pixelData[i + 1], pixelData[i + 2]]);
    }

    // Calculate color histogram
    const histogram = pixels.reduce((hist: { [key: string]: number }, pixel) => {
      const colorKey = pixel.join(',');
      if (!hist[colorKey]) {
        hist[colorKey] = 0;
      }
      hist[colorKey]++;
      return hist;
    }, {});

    // Find color with highest count in histogram
    let maxCount = 0;
    let predominantColor: number[] = [];
    // eslint-disable-next-line guard-for-in
    for (const colorKey in histogram) {
      const count = histogram[colorKey];
      const _color = colorKey.split(',').map(c => parseInt(c));
      if (count > maxCount) {
        maxCount = count;
        predominantColor = _color;
      }
    }

    const color = Screenshot.RgbToHex(predominantColor);
    const luminance = Screenshot.GetColorLuminance(predominantColor);

    logger.debug(`color #${color} / luminance ${luminance}`, { label: 'image'});

    return {
      color,
      luminance,
    };
  };
}
