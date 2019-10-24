'use strict';

/**
 * Expose helper
 */
module.exports = function (options) {
  return (this.id == 'home' || this.id == 'front') ? 'front' : 'not-front';
}
