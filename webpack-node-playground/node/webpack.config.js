const path = require("path");
const packageJson = require("./package.json");

module.exports = {
  entry: "./src/index.js",
  target: "node",
  devtool: "source-map",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: packageJson.name,
    libraryTarget: "umd",
  },
};
