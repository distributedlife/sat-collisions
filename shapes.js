var v = require('./vector');
var p = require('./polygon');

function circle (px, py, radius) {
    return {
        pos: {
            x: px,
            y: py,
        },
        radius: radius
    };
}

function box (px, py, w, h) {
  return polygon(px, py, [
    {x: 0, y: 0}, {x: w, y: 0},
    {x: w, y: h}, {x: 0, y: h}
  ]);
}

function square (px, py, d) {
  return box(px, py, d, d);
}

function triangle (px, py, d) {
  return polygon(px, py, [{x: 0, y: 0}, {x: d, y: 0}, {x: 0, y: d}]);
}

function polygon (px, py, points) {
  var poly = {
    pos: {x: px, y: py},
    angle: 0,
    offset: {x: 0, y: 0}
  };

  return p.setPoints(poly, points);
}

module.exports = {
  circle: circle,
  square: square,
  box: box,
  polygon: polygon,
  triangle: triangle
};