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
   * Takes an array of three numbers representing an RGB color value or a string representing a HEX color and
   * returns the corresponding luminance value.
   *
   * The luminance value is calculated using the relative luminance formula for the
   * sRGB color space.
   *
   * @param value [r,g,b] array or #fff hexstring
   * @returns Luminance 0 - 100
   */
  private static GetColorLuminance = (value: number[] | string, factor = 1) => {
    if (typeof value == 'string') {
      const hasFullSpec = value.length === 7;
      const m = value.match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
        const R = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16);
        const G = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16);
        const B = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);

      return (R * 299 + G * 587 + B * 114) / 1000;
    }
    else {
      const [R8bit, G8bit, B8bit] = value;
      const RsRGB = R8bit / 255;
      const GsRGB = G8bit / 255;
      const BsRGB = B8bit / 255;

      const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      // For the sRGB colorspace, the relative luminance of a color is defined as:
      const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

      return Number((L * 100 * factor).toFixed(2));
    }
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
    const hexArr = getDominantColor(x ?? 0, y ?? 0, width, height);
    logger.debug(`Color from rust ${hexArr}`, { label: 'image' });
    const color = hexArr[0];
    const luminance = Screenshot.GetColorLuminance(hexArr[0], 3);

    logger.debug(`Color #${color} / Luminance ${luminance}`, { label: 'image' });

    return {
      color,
      luminance,
    };
  };
}
