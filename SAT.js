var v = require('./vector');
var c = require('./circle');
var shapes = require('./shapes');
var voronoi = require('./voronoi');

function testCircleCircle (a, b, callback) {
    var differenceV = v.sub(b.pos, a.pos);
    var distanceSq = v.len2(differenceV);

    var totalRadius = a.radius + b.radius;
    var totalRadiusSq = totalRadius * totalRadius;

    if (distanceSq > totalRadiusSq) {
      return;
    }

    var dist = Math.sqrt(distanceSq);
    var overlap = totalRadius - dist;
    var differenceN = v.normalise(differenceV);
    var response = {
        a: a,
        b: b,
        overlap: overlap,
        overlapN: differenceN,
        overlapV: v.scale(differenceN, overlap),
        aInB: a.radius <= b.radius && dist <= b.radius - a.radius,
        bInA: b.radius <= a.radius && dist <= a.radius - b.radius
    };

    callback(response);
}

function testPolygonCircle (polygon, circle, callback) {
    var circlePos = v.sub(circle.pos, polygon.pos);
    var radiusSquared = circle.radius * circle.radius;
    var points = polygon.calcPoints;
    var edge = {x: 0, y: 0};
    var point = {x: 0, y: 0};

    var dist;

    var response = {
      overlapN: {x: 0, y: 0},
      overlapV: {x: 0, y: 0},
      aInB: true,
      bInA: true,
      overlap: Number.MAX_VALUE
    };

    for (var i = 0; i < points.length; i++) {
      var next = i === points.length - 1 ? 0 : i + 1;
      var prev = i === 0 ? points.length - 1 : i - 1;
      var overlap = 0;
      var overlapN = null;

      point = v.sub(circlePos, points[i]);

      if (v.len2(point) > radiusSquared) {
        response.aInB = false;
      }

      var region = voronoi.getRegion(polygon.edges[i], point);
      if (region === voronoi.LEFT) {
        var point2 = v.sub(circlePos, points[prev]);
        region = voronoi.getRegion(polygon.edges[prev], point2);
        if (region === voronoi.RIGHT) {
          dist = v.len(point);

          if (dist > circle.radius) {
            return;
          } else {
            response.bInA = false;
            overlapN = v.normalise(point);
            overlap = circle.radius - dist;
          }
        }
      } else if (region === voronoi.RIGHT) {
        point = v.sub(circlePos, points[next]);
        region = voronoi.getRegion(polygon.edges[next], point);
        if (region === voronoi.LEFT) {
          dist = v.len(point);

          if (dist > circle.radius) {
            return;
          } else {
            response.bInA = false;
            overlapN = v.normalise(point);
            overlap = circle.radius - dist;
          }
        }
      } else {
        var normal = v.normalise(perp(polygon.edges[i]));
        dist = v.dot(point, normal);

        var distAbs = Math.abs(dist);
        if (dist > 0 && distAbs > radius) {
          return;
        } else {
          overlapN = normal;
          overlap = circle.radius - dist;

          if (dist >= 0 || overlap < 2 * circle.radius) {
            response.bInA = false;
          }
        }
      }

      if (overlapN && (Math.abs(overlap) < Math.abs(response.overlap))) {
        response.overlap = overlap;
        response.overlapN = overlapN;
      }
    }

    response.a = polygon;
    response.b = circle;
    response.overlapV = v.scale(response.overlapN, response.overlap);

    callback(response);
}

function testCirclePolygon (circle, polygon, callback) {
  testPolygonCircle(polygon, circle, callback);
}

function flattenPointsOn(points, normal, result) {
  var min = Number.MAX_VALUE;
  var max = -Number.MAX_VALUE;

  for (var i = 0; i < points.length; i++ ) {
    var d = v.dot(points[i], normal);
    if (d < min) { min = d; }
    if (d > max) { max = d; }
  }

  return [min, max];
}

function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
  var offsetV = v.sub(bPos, aPos);
  var projectedOffset = v.dot(offsetV, axis);
  var rangeA = flattenPointsOn(aPoints, axis);
  var rangeB = flattenPointsOn(bPoints, axis);
  rangeB[0] += projectedOffset;
  rangeB[1] += projectedOffset;

  if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
    return true;
  }

  var overlap = 0;
  var option1;
  var option2;

  if (rangeA[0] < rangeB[0]) {
    response.aInB = false;

    if (rangeA[1] < rangeB[1]) {
      overlap = rangeA[1] - rangeB[0];
      response.bInA = false;
    } else {
      option1 = rangeA[1] - rangeB[0];
      option2 = rangeB[1] - rangeA[0];
      overlap = option1 < option2 ? option1 : -option2;
    }
  } else {
    response.bInA = false;

    if (rangeA[1] > rangeB[1]) {
      overlap = rangeA[0] - rangeB[1];
      response.aInB = false;
    } else {
      option1 = rangeA[1] - rangeB[0];
      option2 = rangeB[1] - rangeA[0];
      overlap = option1 < option2 ? option1 : -option2;
    }
  }

  var absOverlap = Math.abs(overlap);
  if (absOverlap < response.overlap) {
    response.overlap = absOverlap;
    response.overlapN = axis;

    if (overlap < 0) {
      v.reverse(response.overlapN);
    }
  }

  return false;
}

function testPolygonPolygon(a, b, callback) {
  var aPoints = a.calcPoints;
  var aLen = aPoints.length;
  var bPoints = b.calcPoints;
  var bLen = bPoints.length;

  var response = {
    overlapN: {x: 0, y: 0},
    overlapV: {x: 0, y: 0},
    aInB: true,
    bInA: true,
    overlap: Number.MAX_VALUE
  };

  for (var i = 0; i < aLen; i++) {
    if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[i], response)) {
      return;
    }
  }

  for (i = 0;i < bLen; i++) {
    if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
      return;
    }
  }

  response.a = a;
  response.b = b;
  response.overlapV = v.scale(response.overlapN, response.overlap);

  callback(response);
}

function testVectorCircle(point, circle, callback) {
  var differenceV = v.sub(point, circle.pos);
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
  var unitSquare = shapes.square(vector.x, vector.y, 1);

  testPolygonPolygon(unitSquare, polygon, callback);
}

function testPolygonVector(polygon, vector, callback) {
  testVectorPolygon(vector, polygon, callback);
}

var testFuncs = {
  'circle-circle': testCircleCircle,
  'polygon-circle': testPolygonCircle,
  'circle-polygon': testCirclePolygon,
  'polygon-polygon': testPolygonPolygon,
  'vector-circle': testVectorCircle,
  'circle-vector': testCircleVector,
  'vector-polygon': testVectorPolygon,
  'polygon-vector': testPolygonVector
};

function determineShape (thing) {
  if (thing.radius) {
    return 'circle';
  } else if (thing.x !== undefined && thing.y !== undefined) {
    return 'vector';
  } else {
    return 'polygon';
  }
}

function test (a, b, callback) {
  var key = [determineShape(a), '-', determineShape(b)].join('');
  testFuncs[key](a, b, callback);
}

module.exports = {
  test: test
};