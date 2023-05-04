import { FileType, Region, screen } from '@nut-tree/nut-js';
import { logger } from '../../shared/Logger';
import sharp from 'sharp';

interface FetchPredominantColorResult {
  color: string;
  luminance: number;
}

export default class Screenshot {
  /**
   * Takes an array of three numbers representing an RGB color value and
   * returns a string representing the equivalent hexadecimal color code.
   *
   * @param rgb [r,g,b] array
   * @returns Hexadecimal color
   */
  private static RgbToHex = (rgb: number[]): string => {
    return [rgb[0], rgb[1], rgb[2]]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');
  };

  /**
   * takes an array of three numbers representing an RGB color value and
   * returns the corresponding luminance value.
   *
   * The luminance value is calculated using the relative luminance formula for the
   * sRGB color space.
   *
   * @param rgb [r,g,b] array
   * @returns Luminance 0 - 100
   */
  private static GetColorLuminance = ([R8bit, G8bit, B8bit]: number[]) => {
    const RsRGB = R8bit / 255;
    const GsRGB = G8bit / 255;
    const BsRGB = B8bit / 255;

    const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as:
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return Number((L * 100).toFixed(2));
  };

  /**
   * This method takes a buffer containing an image and uses the sharp library to calculate
   * the dominant color in the image.
   *
   * The method returns an array containing the RGB values of the dominant color.
   *
   * @param image `Buffer`
   * @returns [r,g,b] array
   */
  private static async DominantColorSharp(image: Buffer) {
    const { dominant } = await sharp(new Int16Array(image)).stats();
    return [dominant.r, dominant.g, dominant.b];
  }

  /**
   * This method takes a buffer containing an image and uses a custom algorithm to
   * calculate the dominant color in the image.
   *
   * The method returns an array containing the RGB values of the dominant color.
   *
   * @param image `Buffer`
   * @returns [r,g,b] array
   * @deprecated
   */
  private static DominantColorRaw(image: Buffer) {
    // NOTE This algorithm has a bug and dont work most of the time
    // Extract all pixels in the region
    const pixelData = image;
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
    let RGBArray: number[] = [];
    // eslint-disable-next-line guard-for-in
    for (const colorKey in histogram) {
      const count = histogram[colorKey];
      const _color = colorKey.split(',').map(c => parseInt(c));
      if (count > maxCount) {
        maxCount = count;
        RGBArray = _color;
      }
    }

    return RGBArray;
  }

  /**
   * Fetches the predominant color and luminance of a region of the screen.
   *
   * @param x {number} the x-coordinate of the top-left corner of the region to capture
   * @param y {number} the y-coordinate of the top-left corner of the region to capture
   * @param width {number} the width of the region to capture
   * @param height {number} the height of the region to capture
   * @returns A Promise that resolves to an object with the predominant color and luminance of the region.
   */
  static FetchPredominantColor = async (
    x: number,
    y: number,
    width: number,
    height: number,
  ): Promise<FetchPredominantColorResult> => {
    const region = new Region(x, y, width, 50);
    const image = await screen.grabRegion(region);

    // TODO Check captured region
    // const png = new PNG({ filterType: 4 });
    // png.parse(image.data);
    // png.pack().pipe(fs.createWriteStream('image.png'));
    if (logger.level === 'debug') {
      logger.warn(`saving region to file`, { label: 'image' });
      await screen.captureRegion('test', region, FileType.PNG);
    }

    const rgbArray = await Screenshot.DominantColorSharp(image.data);
    // const rgbArray = Screenshot.DominantColorRaw(image.data);

    const color = Screenshot.RgbToHex(rgbArray);
    const luminance = Screenshot.GetColorLuminance(rgbArray);

    logger.debug(`raw rgb array ${rgbArray} color #${color} / luminance ${luminance}`, { label: 'image' });

    return {
      color,
      luminance,
    };
  };
}
