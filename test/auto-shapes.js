'use strict';

var autoResolve = require('../lib/shapes').autoResolve;
var expect = require('expect');

describe('auto-resolve shape', function() {
  it('should handle vectors', function () {
    var shape = {x: 3, y: 4};
    expect(autoResolve(shape)).toEqual({x: 3, y: 4});
  });

  it('should handle circles', function () {
    var shape = {position: {x: 3, y: 4}, radius: 25};

    expect(autoResolve(shape)).toEqual({position: {x: 3, y: 4}, radius: 25});
  });

  it('should handle squares using length', function () {
    var shape = {position: {x: 3, y: 4}, length: 10};

    expect(autoResolve(shape)).toEqual({
      angle: 0,
      calcPoints: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }
      ],
      edges: [
        { x: 10, y: 0 }, { x: 0, y: 10 }, { x: -10, y: 0 }, { x: 0, y: -10 }
      ],
      normals: [
        { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
      ],
      offset: { x: 0, y: 0 },
      points: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }
      ],
      position: {x: 3, y: 4}
    });
  });

  it('should handle squares using width', function () {
    var shape = {position: {x: 3, y: 4}, width: 10};

    expect(autoResolve(shape)).toEqual({
      angle: 0,
      calcPoints: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }
      ],
      edges: [
        { x: 10, y: 0 }, { x: 0, y: 10 }, { x: -10, y: 0 }, { x: 0, y: -10 }
      ],
      normals: [
        { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
      ],
      offset: { x: 0, y: 0 },
      points: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }
      ],
      position: {x: 3, y: 4}
    });
  });

  it('should handle squares using height', function () {
    var shape = {position: {x: 3, y: 4}, height: 10};

    expect(autoResolve(shape)).toEqual({
      angle: 0,
      calcPoints: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }
      ],
      edges: [
        { x: 10, y: 0 }, { x: 0, y: 10 }, { x: -10, y: 0 }, { x: 0, y: -10 }
      ],
      normals: [
        { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
      ],
      offset: { x: 0, y: 0 },
      points: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }
      ],
      position: {x: 3, y: 4}
    });
  });

  it('should handle rectangles', function () {
    var shape = {position: {x: 3, y: 4}, width: 10, height: 20};

    expect(autoResolve(shape)).toEqual({
      angle: 0,
      calcPoints: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }, { x: 0, y: 20 }
      ],
      edges: [
        { x: 10, y: 0 }, { x: 0, y: 20 }, { x: -10, y: 0 }, { x: 0, y: -20 }
      ],
      normals: [
        { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
      ],
      offset: { x: 0, y: 0 },
      points: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }, { x: 0, y: 20 }
      ],
      position: {x: 3, y: 4}
    });
  });

  it('should default to polygons', function () {
    var shape = {position: {x: 3, y: 4}, points: [{x: 0, y: 0}, {x: 10, y: 0}, {x: 10, y: 20}, {x: 0, y: 20}]};

    expect(autoResolve(shape)).toEqual({
      angle: 0,
      calcPoints: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }, { x: 0, y: 20 }
      ],
      edges: [
        { x: 10, y: 0 }, { x: 0, y: 20 }, { x: -10, y: 0 }, { x: 0, y: -20 }
      ],
      normals: [
        { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
      ],
      offset: { x: 0, y: 0 },
      points: [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }, { x: 0, y: 20 }
      ],
      position: {x: 3, y: 4}
    });
  });
});