var sat = require('../sat');
var shapes = require('../shapes');
var expect = require('expect');
var assert = require('assert');
var sinon = require('sinon');

describe("collision of", function(){
  it("two circles", function(){
    var circle1 = shapes.circle(0, 0, 20);
    var circle2 = shapes.circle(30, 0, 20);

    var responseHandler = sinon.spy();
    sat.test(circle1, circle2, responseHandler);

    expect(responseHandler.called).toBe(true);
  });

  it("circle and polygon", function(){
    var c = shapes.circle(50, 50, 20);
    var p = shapes.square(0, 0, 40);

    var responseHandler = sinon.spy();
    sat.test(p, c, responseHandler);

    expect(responseHandler.called).toBe(true);
  });

  it("polygon and polygon", function() {
    var s = shapes.square(0, 0, 40);
    var t = shapes.triangle(30, 0, 30);
    var responseHandler = sinon.spy();
    sat.test(s, t, responseHandler);

    expect(responseHandler.called).toBe(true);
  });
});

describe("No collision between", function(){
  it("two boxes", function() {
    var responseHandler = sinon.spy();

    var box1 = shapes.square(0, 0, 20);
    var box2 = shapes.square(100, 10, 20);
    sat.test(box1, box2, responseHandler);

    expect(responseHandler.called).toBe(false);
  });
});

describe("Hit testing", function(){
  it("a circle", function(){
    var c = shapes.circle(100, 10, 20);

    var responseHandler = sinon.spy();

    sat.test({x:0,y:0}, c, responseHandler);
    expect(responseHandler.called).toBe(false);

    sat.test({x:110,y:10}, c, responseHandler);
    expect(responseHandler.called).toBe(true);
  });

  it("a polygon", function(){
    var t = shapes.triangle(30, 0, 30);

    var responseHandler = sinon.spy();

    sat.test({x: 0, y: 0}, t, responseHandler);
    expect(responseHandler.called).toBe(false);

    sat.test({x: 35, y: 5}, t, responseHandler);
    expect(responseHandler.called).toBe(true);
  });
});
