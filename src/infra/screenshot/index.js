const { logger } = require('../../shared/Logger');

try {
  const { getDominantColorCallback, getScreenDimensions } = require('./color.node');

  module.exports.getScreenDimensions = getScreenDimensions;
  module.exports.getDominantColorCallback = getDominantColorCallback;
} catch (e) {
  logger.warn('Rust code not built. To fix this, allow postinstall script to run');
}
