'use strict';

function determineShape (thing) {
  if (thing.radius) {
    return 'circle';
  } else if (thing.x !== undefined && thing.y !== undefined) {
    return 'vector';
  } else {
    return 'polygon';
  }
}

module.exports = determineShape;