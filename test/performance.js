'use strict';

var sat = require('../lib/collision');
var shapes = require('../lib/shapes');
var determineShape = require('../lib/determine-shape');
var expect = require('expect');

var tens = 10;
var hundreds = tens * 10;
var thousands = hundreds * 10;
var tensOfThousands = thousands * 10;
var hundredsOfThousands = tensOfThousands * 10;
var millions = hundredsOfThousands * 10;
var tensOfMillions = millions * 10;
var hundredsOfMillions = tensOfMillions * 10;

var aThousandthOfASecond = 1;
var aHundredthOfASecond = aThousandthOfASecond * 10;
var aTenthOfAsSecond = aHundredthOfASecond * 10;
var aSecond = aTenthOfAsSecond * 10;

function callback () {}

describe('performance testing', function(){
  var s1 = shapes.tlSquare({x: 122, y: 230}, 8);
  var s2 = shapes.tlSquare({x: 130, y: 220}, 10);
  var s3 = shapes.tlSquare({x: 122, y: 231}, 10);

  var p1 = shapes.tlBox({x: 122, y: 230}, 8, 8);
  var p2 = shapes.tlBox({x: 130, y: 220}, 10, 10);
  var p3 = shapes.tlBox({x: 123, y: 231}, 10, 10);

  var c1 = shapes.circle({x: 200, y: 200}, 10);
  var c2 = shapes.circle({x: 100, y: 100}, 10);
  var c3 = shapes.circle({x: 201, y: 201}, 10);

  var start;

  beforeEach(function () {
    start = Date.now();
  });

  it('determining shape', function () {
    for (var i = 0; i < tensOfMillions; i += 1) {
      determineShape(s1);
    }

    expect(Date.now() - start).toBeLessThan(aTenthOfAsSecond);
  });

  describe('not colliding', function () {
    it('testing two polygons', function() {
      for (var i = 0; i < hundredsOfThousands; i += 1) {
        sat.test(p1, p2, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });

    it('testing two squares', function() {
      for (var i = 0; i < millions; i += 1) {
        sat.test(s1, s2, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });


    it('testing two circle', function() {
      for (var i = 0; i < millions; i += 1) {
        sat.test(c1, c2, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });
  });

  describe('colliding, same point', function () {
    it('testing two polygons', function() {
      for (var i = 0; i < millions; i += 1) {
        sat.test(p1, p1, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });

    it('testing two squares', function() {
      for (var i = 0; i < millions; i += 1) {
        sat.test(s1, s1, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });


    it('testing two circle', function() {
      for (var i = 0; i < millions; i += 1) {
        sat.test(c1, c1, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });
  });

  describe('colliding, near', function () {
    it('testing two polygons', function() {
      for (var i = 0; i < hundredsOfThousands; i += 1) {
        sat.test(p1, p3, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });

    it('testing two squares', function() {
      for (var i = 0; i < millions; i += 1) {
        sat.test(s1, s3, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });


    it('testing two circle', function() {
      for (var i = 0; i < millions; i += 1) {
        sat.test(c1, c3, callback);
      }

      expect(Date.now() - start).toBeGreaterThan(aTenthOfAsSecond);
      expect(Date.now() - start).toBeLessThan(aSecond);
    });
  });
});