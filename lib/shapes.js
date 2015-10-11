'use strict';

var p = require('./polygon');

function circle (position, radius) {
  return {
    position: position,
    radius: radius
  };
}

function polygon (position, points) {
  var poly = {
    position: position,
    angle: 0,
    offset: {x: 0, y: 0}
  };

  return p.setPoints(poly, points);
}

function tlBox (position, w, h) {
  return polygon(position, [
    {x: 0, y: 0}, {x: w, y: 0},
    {x: w, y: h}, {x: 0, y: h}
  ]);
}

function cBox (position, w, h) {
  var hw = w/2;
  var hh = h/2;

  return polygon(position, [
    {x: -hw, y: +hh}, {x: +hw, y: +hh},
    {x: +hw, y: -hh}, {x: -hw, y: -hh}
  ]);
}

function tlSquare (position, d) {
  return tlBox(position, d, d);
}

function cSquare (position, d) {
  return cBox(position, d, d);
}

function triangle (position, d) {
  return polygon(position, [{x: 0, y: 0}, {x: d, y: 0}, {x: 0, y: d}]);
}

module.exports = {
  circle: circle,
  tlSquare: tlSquare,
  tlBox: tlBox,
  tlRectangle: tlBox,
  cSquare: cSquare,
  cBox: cBox,
  cRectangle: cBox,
  polygon: polygon,
  triangle: triangle
};