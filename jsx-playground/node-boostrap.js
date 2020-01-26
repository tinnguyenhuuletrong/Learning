const path = require("path");
require("@babel/register");

// -------------------------------------------------//
//  Run!
// -------------------------------------------------//
if (process.env.NODE_ENV !== "test") {
  if (process.argv[2]) {
    require(path.join(process.cwd(), process.argv[2]));
  } else {
    console.log("node-boostrap <path to js file>");
  }
}
