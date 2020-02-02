/* eslint-disable */

// var debug = require('debug')('express-list-endpoints')
const ld = require("lodash");
const os = require("os");
const fs = require("fs");

/**
 * Print in console all the verbs detected for the passed route
 */
const getRouteMethods = function(route) {
  const methods = [];

  for (const method in route.methods) {
    if (method === "_all") continue;

    methods.push(method.toUpperCase());
  }

  return methods;
};

/**
 * Return true if found regexp related with express params
 */
const hasParams = function(value) {
  const regExp = /\(\?:\(\[\^\\\/]\+\?\)\)/g;
  return regExp.test(value);
};

/**
 * Return an array of strings with all the detected endpoints
 */
var getEndpoints = function(app, path, endpoints) {
  const regExp = /^\/\^\\\/(?:(:?[\w\\.-]*(?:\\\/:?[\w\\.-]*)*)|(\(\?:\(\[\^\\\/]\+\?\)\)))\\\/.*/;
  const stack = app.stack || (app._router && app._router.stack);

  endpoints = endpoints || [];
  path = path || "";

  stack.forEach(val => {
    if (val.route) {
      endpoints.push({
        path: path + (path && val.route.path === "/" ? "" : val.route.path),
        methods: getRouteMethods(val.route)
      });
    } else if (val.name === "router" || val.name === "bound dispatch") {
      let newPath = regExp.exec(val.regexp);

      if (newPath) {
        let parsedRegexp = val.regexp;
        let keyIndex = 0;
        let parsedPath;

        while (hasParams(parsedRegexp)) {
          parsedRegexp = parsedRegexp
            .toString()
            .replace(/\(\?:\(\[\^\\\/]\+\?\)\)/, `:${val.keys[keyIndex].name}`);
          keyIndex++;
        }

        if (parsedRegexp !== val.regexp) {
          newPath = regExp.exec(parsedRegexp);
        }

        parsedPath = newPath[1].replace(/\\\//g, "/");

        if (parsedPath === ":postId/sub-router") console.log(val);

        getEndpoints(val.handle, `${path}/${parsedPath}`, endpoints);
      } else {
        getEndpoints(val.handle, path, endpoints);
      }
    }
  });

  return endpoints;
};

function updateRawDoc({ outPath, endpoints }) {
  let strBuffer = "";
  const template = `
/**
* Check system status
* @route #{METHOD} #{PATH}
* @group #{GROUP}
*/`;

  endpoints.forEach(({ path, methods }) => {
    const nomalizePath = path.replace("\\", "");
    const mathList = nomalizePath.match(/(kyc\/1.0)(.*)/);
    const routePath = mathList[2];
    const moduleName = routePath.match(/([a-z-.:])+/gi)[0];
    const moduleText = template
      .replace("#{METHOD}", methods[0])
      .replace("#{PATH}", routePath)
      .replace("#{GROUP}", ld.capitalize(moduleName));

    strBuffer = strBuffer.concat(`${os.EOL}${moduleText}`);
  });
  fs.writeFileSync(outPath, strBuffer);
}

module.exports = { getEndpoints, updateRawDoc };
