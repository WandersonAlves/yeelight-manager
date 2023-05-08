import { getDominantColor } from '.';
import { logger } from '../../shared/Logger';

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
    const rgbArray = getDominantColor(x ?? 0, y ?? 0, width, height);

    const color = Screenshot.RgbToHex(rgbArray[0]);
    const luminance = Screenshot.GetColorLuminance(rgbArray[0]);

    logger.debug(`Color #${color} / Luminance ${luminance}`, { label: 'image' });

    return {
      color,
      luminance,
    };
  };
}
