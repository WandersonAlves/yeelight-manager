import { getScreenDimensions } from '.';
import { logger } from '../../shared/Logger';

export default class Screenshot {
  /**
   * Gets the size of the top-bottom box area to be used on Rust side
   *
   * @param width Width
   * @param height Height
   * @param factor Factor
   */
  private static GetBoxSizeTopBottom = (width: number, height: number, factor = 1) => ({
    width: width * factor,
    height: Number((height * 0.12).toFixed(0)) * factor,
  });

  /**
   * Gets the size of the left-right box area to be used on Rust side
   *
   * @param width Width
   * @param height Height
   * @param factor Factor
   */
  private static GetBoxSizeLeftRight = (width: number, height: number, factor = 1) => ({
    width: Number((width * 0.12).toFixed(0)) * factor,
    height: height * factor,
  });

  /**
   * Get area dimension to be used on getDominantColorCallback
   *
   * @param value Can be a string like `<width>x<height>x<X>x<Y>` (ex: 1280x135x640x100) or one of default areas `top`, `bottom`, `left` and `right`
   * @returns
   */
  static GetScreenAreaDimensions = (value: string) => {
    logger.debug(`Value received: ${value}`, { label: 'Screenshot.GetScreenAreaDimensions' });
    const [width, height, x, y] = value.split('x').map(v => Number(v));
    if (!isNaN(width) || !isNaN(height) || !isNaN(x) || !isNaN(y)) {
      return {
        width,
        height,
        x,
        y,
      };
    }
    const [sWidth, sHeight] = getScreenDimensions();
    logger.debug(`Value received from rust: ${sWidth} x ${sHeight}`, { label: 'Screenshot.GetScreenAreaDimensions' });
    switch (value) {
      case 'top': {
        const cWidth = sWidth * 0.1;
        return {
          x: sWidth / 2 - cWidth / 2,
          y: 0,
          ...Screenshot.GetBoxSizeTopBottom(cWidth, sHeight),
        };
      }
      case 'bottom': {
        const cWidth = sWidth * 0.1;
        return {
          x: sWidth / 2 - cWidth / 2,
          y: sHeight - 100,
          ...Screenshot.GetBoxSizeTopBottom(cWidth, sHeight),
        };
      }
      case 'left': {
        const cHeight = sHeight * 0.1;
        const cWidth = sWidth / 2;
        return {
          x: 0,
          y: sHeight / 2 - cHeight / 2,
          ...Screenshot.GetBoxSizeLeftRight(cWidth, cHeight),
        };
      }
      case 'right': {
        const cHeight = sHeight * 0.1;
        const cWidth = sWidth / 2;
        return {
          x: sWidth - 100,
          y: sHeight / 2 - cHeight / 2,
          ...Screenshot.GetBoxSizeLeftRight(cWidth, cHeight),
        };
      }
      default: {
        return { width, height, x: width / 4, y: 100 };
      }
    }
  };
}
