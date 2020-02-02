var PouchDB = require("pouchdb");
var express = require("express");

const { getEndpoints } = require("./listEndpoints");
let app = express();

//https://github.com/Level/awesome
const MyPouchDB = PouchDB.defaults({
  prefix: "./_db/"
});
global.pouchDbIns = new MyPouchDB("metadata");

// PouchDB
const pouchdbApp = require("express-pouchdb")(MyPouchDB, {
  mode: "minimumForPouchDB"
});
app.use("/db", pouchdbApp);

// Public
app.use("/public", express.static("public"));

app.listen(3000, () => {
  console.log("Listening on 3000");

  console.table(getEndpoints(pouchdbApp), ["path", "methods"]);
  // console.log(app._router.stack);
});
