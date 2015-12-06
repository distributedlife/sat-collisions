'use strict';

var sat = require('../lib/collision');
var shapes = require('../lib/shapes');
var expect = require('expect');
var sinon = require('sinon');

describe('collision of', function(){
  it('two circles', function(){
    var circle1 = shapes.circle({x: 0, y: 0}, 20);
    var circle2 = shapes.circle({x: 30, y: 0}, 20);

    var responseHandler = sinon.spy();
    var result = sat.test(circle1, circle2, responseHandler);

    expect(responseHandler.called).toBe(true);
    expect(result).toBe(true);
  });

  it('circle and polygon', function(){
    var c = shapes.circle({x: 50, y: 50}, 20);
    var p = shapes.tlSquare({x: 0, y: 0}, 40);

    var responseHandler = sinon.spy();
    var result = sat.test(p, c, responseHandler);

    expect(responseHandler.called).toBe(true);
    expect(result).toBe(true);
  });

  it('polygon and polygon', function() {
    var s = shapes.tlSquare({x: 0, y: 0}, 40);
    var t = shapes.triangle({x: 30, y: 0}, 30);
    var responseHandler = sinon.spy();
    var result = sat.test(s, t, responseHandler);

    expect(responseHandler.called).toBe(true);
    expect(result).toBe(true);
  });

  it('vector and vector', function() {
    var s = {x: 0, y: 0};
    var t = {x: 0, y: 0};
    var responseHandler = sinon.spy();
    var result = sat.test(s, t, responseHandler);

    expect(responseHandler.called).toBe(true);
    expect(result).toBe(true);
  });
});

describe('No collision between', function(){
  it('two boxes', function() {
    var responseHandler = sinon.spy();

    var box1 = shapes.tlSquare({x: 0, y: 0}, 20);
    var box2 = shapes.tlSquare({x: 100, y: 10}, 20);
    var result = sat.test(box1, box2, responseHandler);

    expect(responseHandler.called).toBe(false);
    expect(result).toBe(false);
  });
});

describe('Hit testing', function(){
  it('a circle', function(){
    var c = shapes.circle({x: 100, y: 10}, 20);

    var responseHandler = sinon.spy();

    var result = sat.test({x:0,y:0}, c, responseHandler);
    expect(responseHandler.called).toBe(false);
    expect(result).toBe(false);

    result = sat.test({x:110,y:10}, c, responseHandler);
    expect(responseHandler.called).toBe(true);
    expect(result).toBe(true);
  });

  it('a polygon', function(){
    var t = shapes.triangle({x: 30, y: 0}, 30);

    var responseHandler = sinon.spy();

    var result = sat.test({x: 0, y: 0}, t, responseHandler);
    expect(responseHandler.called).toBe(false);
    expect(result).toBe(false);

    result = sat.test({x: 35, y: 5}, t, responseHandler);
    expect(responseHandler.called).toBe(true);
    expect(result).toBe(true);
  });
});
