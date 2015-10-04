var v = require('./vector');

function getAABB (c) {
  var corner = v.sub(c.pos, {x: c.radius, y: c.radius});
  return shapes.square(corner.x, corner.y, c.radius * 2);
}

module.exports = {
  getAABB: getAABB
};