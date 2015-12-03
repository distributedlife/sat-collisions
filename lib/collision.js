'use strict';

var v = require('./vector');
var shapes = require('./shapes');
var voronoi = require('./voronoi');

function testCircleCircle (a, b, callback) {
  var differenceV = v.sub(b.position, a.position);
  var distanceSq = v.len2(differenceV);

  var totalRadius = a.radius + b.radius;
  var totalRadiusSq = totalRadius * totalRadius;

  if (distanceSq > totalRadiusSq) {
    return;
  }

  callback();
}

function isSomething (point, radius) {
  return (v.len(point) > radius);
}

function excludeLeftVoronai (circlePos, prevPoint, prevEdge, point, radius, edge) {
  if (voronoi.getRegion(edge, point) !== voronoi.LEFT) {
    return false;
  }

  var point2 = v.sub(circlePos, prevPoint);
  var region = voronoi.getRegion(prevEdge, point2);

  return (region === voronoi.RIGHT && isSomething(point, radius));
}

function excludeRightVoronoi (circlePos, nextPoint, nextEdge, point, radius, edge) {
  if (voronoi.getRegion(edge, point) !== voronoi.RIGHT) {
    return false;
  }

  var point2 = v.sub(circlePos, nextPoint);
  var region = voronoi.getRegion(nextEdge, point2);

  return (region === voronoi.LEFT && isSomething(point2, radius));
}

function excludeMiddleVoronoi (point, edge, radius) {
  var normal = v.normalise(v.perp(edge));
  var dist = v.dot(point, normal);

  return (dist > 0 && (Math.abs(dist) > radius));
}

function testPolygonCircle (polygon, circle, callback) {
  var circlePos = v.sub(circle.position, polygon.position);
  var points = polygon.calcPoints;
  var edges = polygon.edges;

  for (var i = 0; i < points.length; i += 1) {
    var next = i === points.length - 1 ? 0 : i + 1;
    var prev = i === 0 ? points.length - 1 : i - 1;

    var point = v.sub(circlePos, points[i]);

    if (excludeLeftVoronai(circlePos, points[prev], edges[prev], point, circle.radius, edges[i])) {
      return;
    }
    if (excludeRightVoronoi(circlePos, points[next], edges[next], point, circle.radius, edges[i])) {
      return;
    }
    if (excludeMiddleVoronoi(point, edges[i], circle.radius)) {
      return;
    }
  }

  callback();
}

function testCirclePolygon (circle, polygon, callback) {
  testPolygonCircle(polygon, circle, callback);
}

function flattenPointsOn(points, normal) {
  var min = Number.MAX_VALUE;
  var max = -Number.MAX_VALUE;

  for (var i = 0; i < points.length; i += 1) {
    var d = v.dot(points[i], normal);
    if (d < min) { min = d; }
    if (d > max) { max = d; }
  }

  return [min, max];
}

function isSeparatingAxis (aPos, bPos, aPoints, bPoints, axis) {
  var offsetV = v.sub(bPos, aPos);
  var projectedOffset = v.dot(offsetV, axis);
  var rangeA = flattenPointsOn(aPoints, axis);
  var rangeB = flattenPointsOn(bPoints, axis);
  rangeB[0] += projectedOffset;
  rangeB[1] += projectedOffset;

  return (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]);
}

function testPolygonPolygon(a, b, callback) {
  var aPoints = a.calcPoints;
  var aLen = aPoints.length;
  var bPoints = b.calcPoints;
  var bLen = bPoints.length;

  for (var i = 0; i < aLen; i += 1) {
    if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i])) {
      return;
    }
  }

  for (i = 0;i < bLen; i += 1) {
    if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, b.normals[i])) {
      return;
    }
  }

  callback();
}

function testVectorCircle(point, circle, callback) {
  var differenceV = v.sub(point, circle.position);
  var radiusSq = circle.radius * circle.radius;
  var distanceSq = v.len2(differenceV);

  if (distanceSq <= radiusSq) {
    callback();
  }
}

function testCircleVector(circle, vector, callback) {
  testVectorCircle(vector, circle, callback);
}

function testVectorPolygon(vector, polygon, callback) {
  var unitSquare = shapes.tlSquare(vector, 1);

  testPolygonPolygon(unitSquare, polygon, callback);
}

function testPolygonVector(polygon, vector, callback) {
  testVectorPolygon(vector, polygon, callback);
}

function testVectorVector(v1, v2, callback) {
  if (v1.x === v2.x && v1.y === v2.y) {
    callback();
  }
}

var testFuncs = {
  'circle-circle': testCircleCircle,
  'polygon-circle': testPolygonCircle,
  'circle-polygon': testCirclePolygon,
  'polygon-polygon': testPolygonPolygon,
  'vector-circle': testVectorCircle,
  'circle-vector': testCircleVector,
  'vector-polygon': testVectorPolygon,
  'polygon-vector': testPolygonVector,
  'vector-vector': testVectorVector
};

var determineShape = require('./determine-shape');

function test (a, b, callback) {
  var key = [determineShape(a), '-', determineShape(b)].join('');
  testFuncs[key](a, b, callback);
}

module.exports = {
  test: test
};