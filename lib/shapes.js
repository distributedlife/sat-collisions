'use strict';

var p = require('./polygon');

function circle (px, py, radius) {
  return {
    position: {
        x: px,
        y: py,
    },
    radius: radius
  };
}

function polygon (px, py, points) {
  var poly = {
    position: {x: px, y: py},
    angle: 0,
    offset: {x: 0, y: 0}
  };

  return p.setPoints(poly, points);
}

function tlBox (px, py, w, h) {
  return polygon(px, py, [
    {x: 0, y: 0}, {x: w, y: 0},
    {x: w, y: h}, {x: 0, y: h}
  ]);
}

function cBox (cx, cy, w, h) {
  var hw = w/2;
  var hh = h/2;

  return polygon(cx, cy, [
    {x: -hw, y: +hh}, {x: +hw, y: +hh},
    {x: +hw, y: -hh}, {x: -hw, y: -hh}
  ]);
}

function tlSquare (px, py, d) {
  return tlBox(px, py, d, d);
}

function cSquare (px, py, d) {
  return cBox(px, py, d, d);
}

function triangle (px, py, d) {
  return polygon(px, py, [{x: 0, y: 0}, {x: d, y: 0}, {x: 0, y: d}]);
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