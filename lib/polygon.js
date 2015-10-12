'use strict';

var v = require('./vector');
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
      v.rotate(calcPoint, angle);
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

function setPoints (polygon, points) {
  var lengthChanged = !polygon.points || polygon.points.length !== points.length;

  var calcPoints = [];
  var edges = [];
  var normals = [];
  if (lengthChanged) {
    for (var i = 0; i < points.length; i += 1) {
      calcPoints.push({x: 0, y: 0});
      edges.push({x: 0, y: 0});
      normals.push({x: 0, y: 0});
    }
  }

  return recalc({
    position: polygon.position,
    angle: polygon.angle,
    offset: polygon.offset,
    points: points,
    calcPoints: lengthChanged ? calcPoints : polygon.calcPoints,
    edges: lengthChanged ? edges : polygon.edges,
    normals: lengthChanged ? normals : polygon.normals
  });
}

function rotate (p, angle) {
  var points = [];

  for (var i = 0; i < p.points.length; i += 1) {
    points.push(v.rotate(p.points[i], angle));
  }

  return setPoints(p, points);
}

function translate (p, vector) {
  var points = [];

  for (var i = 0; i < p.points.length; i += 1) {
    points.push(v.add(p.points[i], vector));
  }

  return setPoints(p, points);
}

function setAngle(p, angle) {
  return setPoints({
    position: p.position,
    angle: angle,
    offset: p.offset,
  }, p.points);
}

function setOffset(p, offset) {
  return setPoints({
    position: p.position,
    angle: p.angle,
    offset: offset,
  }, p.points);
}

function getAABB (polygon) {
  var xMin = polygon.points[0].x;
  var yMin = polygon.points[0].y;
  var xMax = polygon.points[0].x;
  var yMax = polygon.points[0].y;

  for (var i = 1; i < polygon.calcPoints.length; i += 1) {
    var point = polygon.calcPoints[i];
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

  tlBox(v.add(polygon.position, {x: xMin, y: yMin}), xMax - xMin, yMax - yMin);
}

module.exports = {
  rotate: rotate,
  translate: translate,
  setPoints: setPoints,
  setOffset: setOffset,
  setAngle: setAngle,
  getAABB: getAABB
};