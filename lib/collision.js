'use strict';

var v = require('./vector');
var shapes = require('./shapes');
var voronoi = require('./voronoi');

function areSamePoint(v1, v2) {
  return (v1.x === v2.x && v1.y === v2.y);
}

function testVectorVector(v1, v2, callback) {
  if (areSamePoint(v1, v2)) {
    callback();
    return true;
  }

  return false;
}

function circleTest (v1, vr1, v2, vr2) {
  var differenceV = v.sub(v1, v2);
  var distanceSq = v.len2(differenceV);

  var totalRadius = vr1 + vr2;
  var totalRadiusSq = totalRadius * totalRadius;

  return (distanceSq <= totalRadiusSq);
}

function left(p, size) { return p.x; }
function right(p, size) { return p.x + size; }
function top(p, size) { return p.y; }
function bottom(p, size) { return p.y + size; }

function checkAABBCollision(a, aSize, b, bSize) {
  var aIsToTheRightOfB = left(a, aSize) > right(b, bSize);
  var aIsToTheLeftOfB = right(a, aSize) < left(b, bSize);
  var aIsAboveB = bottom(a, aSize) < top(b, bSize);
  var aIsBelowB = top(a, aSize) > bottom(b, bSize);

  return !(aIsToTheRightOfB || aIsToTheLeftOfB || aIsAboveB || aIsBelowB);
}

function testCircleCircle (a, b, callback) {
  if (areSamePoint(a.position, b.position)) {
    callback();
    return true;
  }

  if (circleTest(a.position, a.radius, b.position, b.radius)) {
    callback();
    return true;
  }

  return false;
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
  if (areSamePoint(polygon.position, circle.position)) {
    callback();
    return true;
  }

  var circlePos = v.sub(circle.position, polygon.position);
  var points = polygon.calcPoints;
  var edges = polygon.edges;

  for (var i = 0; i < points.length; i += 1) {
    var next = i === points.length - 1 ? 0 : i + 1;
    var prev = i === 0 ? points.length - 1 : i - 1;

    var point = v.sub(circlePos, points[i]);

    if (excludeLeftVoronai(circlePos, points[prev], edges[prev], point, circle.radius, edges[i])) {
      return false;
    }
    if (excludeRightVoronoi(circlePos, points[next], edges[next], point, circle.radius, edges[i])) {
      return false;
    }
    if (excludeMiddleVoronoi(point, edges[i], circle.radius)) {
      return false;
    }
  }

  callback();
  return true;
}

function testCirclePolygon (circle, polygon, callback) {
  return testPolygonCircle(polygon, circle, callback);
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

function approximateRadius (p) {
  switch(p.hint) {
  case 'square':
    return p.length || p.size || p.width || p.height;
  case 'rect':
    return (p.width > p.height ? p.width : p.height);
  default:
    return undefined;
  }
}

function testPolygonPolygon(a, b, callback) {
  if (areSamePoint(a.position, b.position)) {
    callback();
    return true;
  }

  var aRadius = approximateRadius(a);
  var bRadius = approximateRadius(b);
  if (aRadius && bRadius) {
    if (!circleTest(a.position, aRadius, b.position, bRadius)) {
      return false;
    }
  }

  if (a.hint === 'square' && b.hint === 'square') {
    if (checkAABBCollision(a.position, a.length, b.position, b.length)) {
      callback();
      return true;
    }
  }

  var aPoints = a.calcPoints;
  var aLen = aPoints.length;
  var bPoints = b.calcPoints;
  var bLen = bPoints.length;

  for (var i = 0; i < aLen; i += 1) {
    if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i])) {
      return false;
    }
  }

  for (i = 0;i < bLen; i += 1) {
    if (isSeparatingAxis(a.position, b.position, aPoints, bPoints, b.normals[i])) {
      return false;
    }
  }

  callback();
  return true;
}

function testVectorCircle(point, circle, callback) {
  var differenceV = v.sub(point, circle.position);
  var radiusSq = circle.radius * circle.radius;
  var distanceSq = v.len2(differenceV);

  if (distanceSq <= radiusSq) {
    callback();
    return true;
  }

  return false;
}

function testCircleVector(circle, vector, callback) {
  return testVectorCircle(vector, circle, callback);
}

function testVectorPolygon(vector, polygon, callback) {
  var unitSquare = shapes.tlSquare(vector, 1);

  return testPolygonPolygon(unitSquare, polygon, callback);
}

function testPolygonVector(polygon, vector, callback) {
  return testVectorPolygon(vector, polygon, callback);
}

var testFuncs = {
  'circle-circle': testCircleCircle,
  'circle-polygon': testCirclePolygon,
  'circle-vector': testCircleVector,
  'vector-circle': testVectorCircle,
  'vector-polygon': testVectorPolygon,
  'vector-vector': testVectorVector,
  'polygon-circle': testPolygonCircle,
  'polygon-polygon': testPolygonPolygon,
  'polygon-vector': testPolygonVector
};

var determineShape = require('./determine-shape');

function buildKey (a, b) {
  return [determineShape(a), '-', determineShape(b)].join('');
}

function test (a, b, callback) {
  return testFuncs[buildKey(a, b)](a, b, callback);
}

module.exports = {
  test: test
};