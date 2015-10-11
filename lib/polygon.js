'use strict';

var v = require('./vector');
var p = require('./polygon');
var tlBox = require('./shapes').tlBox;

function recalc (polygon) {
  var calcPoints = polygon.calcPoints;
  var edges = polygon.edges;
  var normals = polygon.normals;
  var points = polygon.points;
  var offset = polygon.offset;
  var angle = polygon.angle;

  for (var i = 0; i < points.length; i += 1) {
    var calcPoint = v.add(points[i], offset);
    if (angle !== 0) {
      p.rotate(calcPoint, angle);
    }

    calcPoints[i] = calcPoint;
  }

  for (i = 0; i < points.length; i += 1) {
    var p1 = calcPoints[i];
    var p2 = i < points.length - 1 ? calcPoints[i + 1] : calcPoints[0];
    edges[i] = v.sub(p2, p1);
    normals[i] = v.normalise(v.perp(edges[i]));
  }

  return polygon;
}

function rotate (p, angle) {
  for (var i = 0; i < p.points.length; i += 1) {
    p.points[i] = v.rotate(p.points[i], angle);
  }

  return recalc(p);
}

function translate (p, x, y) {
  for (var i = 0; i < p.points.length; i += 1) {
    p.points[i] = v.add(p.points[i], {x: x, y: y});
  }

  return recalc(p);
}

function setPoints (polygon, points) {
    var lengthChanged = !polygon.points || polygon.points.length !== points.length;

    if (lengthChanged) {
      var calcPoints = polygon.calcPoints = [];
      var edges = polygon.edges = [];
      var normals = polygon.normals = [];

      for (var i = 0; i < points.length; i += 1) {
        calcPoints.push({x: 0, y: 0});
        edges.push({x: 0, y: 0});
        normals.push({x: 0, y: 0});
      }
    }

    polygon.points = points;

    return recalc(polygon);
}

function setAngle(p, angle) {
  p.angle = angle;
  return recalc(p);
}

function setOffset(p, offset) {
  p.offset = offset;
  return recalc(p);
}

function getAABB (points) {
  var xMin = points[0].x;
  var yMin = points[0].y;
  var xMax = points[0].x;
  var yMax = points[0].y;

  for (var i = 1; i < p.calcPoints.length; i += 1) {
    var point = p.calcPoints[i];
    if (point.x < xMin) {
      xMin = point.x;
    }
    else if (point.x > xMax) {
      xMax = point.x;
    }
    if (point.y < yMin) {
      yMin = point.y;
    }
    else if (point.y > yMax) {
      yMax = point.y;
    }
  }

  tlBox(v.add(p.position, {x: xMin, y: yMin}), xMax - xMin, yMax - yMin);
}

module.exports = {
  rotate: rotate,
  translate: translate,
  setPoints: setPoints,
  setOffset: setOffset,
  setAngle: setAngle,
  getAABB: getAABB
};