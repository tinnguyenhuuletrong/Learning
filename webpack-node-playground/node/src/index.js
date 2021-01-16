const get = require("lodash/get");

function safeGetWithLodash(obj, path) {
  return get(obj, path);
}

function test() {
  console.log("test");
}
console.log("loaded");
module.exports = { safeGetWithLodash, test };
