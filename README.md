# distributedlife-sat

This project is a rewrite of [Jim Riecken's SAT.js](http://jriecken.github.io/sat-js/) library. I rewrote it on a flight back to see family in coding style that suites me. I also trimmed out stuff I don't think I need. It's not compatible due to API changes but all the tests still pass.

# About

SAT.js is a simple JavaScript library for performing collision detection (and projection-based collision response) of simple 2D shapes.  It uses the [Separating Axis Theorem](http://en.wikipedia.org/wiki/Hyperplane_separation_theorem) (hence the name)

It supports detecting collisions between:
 - Circles (using Voronoi Regions.)
 - Convex Polygons (and simple Axis-Aligned Boxes, which are of course, convex polygons.)

It also supports checking whether a point is inside a circle or polygon.

When a collision occurs your callback gets invoked.

It's released under the [MIT](http://en.wikipedia.org/wiki/MIT_License) license.

To use it in node.js, you can run `npm install distributedlife-sat` and then use it with `var SAT = require('distributedlife-sat');`

# Functions

I took a more functional approach than the original. All you have is functions and data. Functions return new versions of data, so through away your old stuff.

The original SAT.js library has a bunch of performance stuff around limiting reallocs, etc. I have stripped all that out as using this for high-performance stuff isn't an objective.


## Collisions
I collapsed the original set of functions that run different algorithms depending on whether you have one or two circles, polygons or points into a single function. This works out what structure you have and calls the appropriate algorithm.

- if you have a `radius`, you're a circle
- if you have an `x` and a `y`, you're a vector
- otherwise, you're a polygon

```
function callMeOnCollision () {
  console.log('ouch');
}

var test = require('distributedlife-sat').collisions.test;
test(a, b, callMeOnCollision)
```

At present we call your callback on collision and you get no further information about who was doing, what direction they were heading, etc.

## Shapes

Inside is a helper file with a bunch of shapes. These make it easier for you to create objects for colliding. These objects exist in your physics models. I make no promises about how easy it may be to render them. I like to keep my physics model and my rendering model separate.

Most shapes take a point that is their anchor in world space. For the circle, this will be the center. For the rectangles you have the option of a centre oriented `c` object or a top-left `tl` oriented one.
```
var shapes = require('distributedlife-sat').shapes;

var origin = {x: 0, y: 0};
var width = 25;
var height = 25;

circle(origin, 25);
tlSquare(origin, width);
tlBox(origin, width, height);
tlRectangle(origin, width, height);
cSquare(origin, width);
cBox(origin, width, height);
cRectangle(origin, width, height);
polygon(points, [{x: 0, y: 0}, {x: 100, y: 100}, {x: 0, y: 100}]);
triangle(origin, width);
```

The `box` and `rectangles` are synonyms.

## Useful Vector Functions

All of these functions return new vectors and do not modify the supplied vectors.

- **sub** (v1, v2) - subtract v2 from v1 and return the new vector
- **add** (v1, v2) - add v2 to v1 and return the new vector
- **dot** (v1, v2) - return the dot product of v1 and v2
- **len2** (v) - return dot product of the vector and itself
- **len** (v) - return the magnitude of the vector
- **normalise** (v) - return the normal of the vector
- **scale** (v1, v2) - scale v1 by v2. If v2 only has an x coordinate, it scales both x and y of v1 by v2.x
- **perp** (v) - return the vector perpendicular to the supplied vector
- **rotate** (v, angle) - return the vector that is a rotate of `angle` on `v`
- **reverse** (v) - return the reverse of the vector
- **project** (v1, v2) - project v1 on v2.
- **reflect** (v, axis) - reflect the vector along the supplied axis

## Useful Polygon Functions

All of these functions return new polygons and do not modify the supplied polygons.

- **rotate** (polygon, angle) - rotate polygon by angle
- **translate** (polygon, vector) - translate polygon by vector
- **setPoints** (polygon, points) - set the points of the polygon
- **setOffset** (polygon, offset) - change the offset of the polygon from it's world origin
- **setAngle** (polygon, angle) - set the angle of the polygon
- **getAABB** (polygon) - return the Axis-Aligned Bounding Box for the polygon

## Useful Circle Functions

- getAABB (circle) - return the Axis Aligned Bounding Box for the supplied circle.


# Tests

To run the tests from your console:

```
mocha
```

To install `mocha` you will need to have run `npm install` after cloning the repo.
