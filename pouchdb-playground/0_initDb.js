const fs = require("fs");
const PouchDB = require("pouchdb");

async function main(params) {
  fs.mkdirSync("_db");
  const db = new PouchDB("metadata", { prefix: "./_db/" });
  await db.bulkDocs([
    {
      name: "green",
      type: "color",
    },
    {
      name: "red",
      type: "color",
    },
    {
      name: "blue",
      type: "color",
    },
  ]);
}

main();
