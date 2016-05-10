'use strict';

var sat = require('../lib/collision');
var shapes = require('../lib/shapes');
var expect = require('expect');
var sinon = require('sinon');

describe('inclusive edge testing', function(){
  it('two squares', function() {
    var s = shapes.tlSquare({x: 122, y: 230}, 8);
    var t = shapes.tlSquare({x: 130, y: 220}, 10);
    var responseHandler = sinon.spy();
    var result = sat.test(s, t, responseHandler);

    expect(responseHandler.called).toBe(true);
    expect(result).toBe(true);
  });

  it('two squares again', function() {
    var s = shapes.tlSquare({x: 208, y: 368}, 15);
    var t = shapes.tlSquare({x: 218, y: 384}, 15);
    var responseHandler = sinon.spy();
    var result = sat.test(s, t, responseHandler);

    expect(responseHandler.called).toBe(false);
    expect(result).toBe(false);
  });
});