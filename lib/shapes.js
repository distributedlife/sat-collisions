'use strict';

var p = require('./polygon');
var determineShape = require('./determine-shape');

function circle (point, radius) {
  return {
    position: point,
    radius: radius
  };
}

function polygon (point, points) {
  var poly = {
    position: point,
    angle: 0,
    offset: {x: 0, y: 0},
    hint: 'poly'
  };

  return p.setPoints(poly, points);
}

function tlBox (point, w, h) {
  var b = polygon(point, [
    {x: 0, y: 0}, {x: w, y: 0},
    {x: w, y: h}, {x: 0, y: h}
  ]);

  b.hint = 'rect';
  b.width = w;
  b.height = h;
  return b;
}

function cBox (point, w, h) {
  var hw = w/2;
  var hh = h/2;

  var b = polygon(point, [
    {x: -hw, y: +hh}, {x: +hw, y: +hh},
    {x: +hw, y: -hh}, {x: -hw, y: -hh}
  ]);

  b.hint = 'rect';
  b.width = w;
  b.height = h;
  return b;
}

function tlSquare (point, d) {
  var s = tlBox(point, d, d);
  s.hint = 'square';
  s.size = d;
  s.length = d;
  return s;
}

function cSquare (point, d) {
  var s = cBox(point, d, d);
  s.hint = 'square';
  s.size = d;
  s.length = d;
  return s;
}

function triangle (point, d) {
  return polygon(point, [{x: 0, y: 0}, {x: d, y: 0}, {x: 0, y: d}]);
}

function handlePolygons (thing) {
  if (thing.length) {
    return tlSquare(thing.position, thing.length);
  } else if (thing.width && thing.height) {
    return tlBox(thing.position, thing.width, thing.height);
  } else if (thing.width) {
    return tlSquare(thing.position, thing.width);
  } else if (thing.height) {
    return tlSquare(thing.position, thing.height);
  } else if (thing.size) {
    return tlSquare(thing.position, thing.size);
  } else {
    return polygon(thing.position, thing.points) ;
  }
}

function autoResolve (thing) {
  switch (determineShape(thing)) {
    case 'circle':
      return circle(thing.position, thing.radius);
    case 'vector':
      return thing;
    default:
      return handlePolygons(thing);
  }
}

module.exports = {
  autoResolve: autoResolve,
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