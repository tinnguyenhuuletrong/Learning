const PouchDB = require("pouchdb");

async function main(params) {
  const db = new PouchDB("metadata", { prefix: "./_db/" });
  const data = await db.get("03c1b2d6-168a-490a-8c13-a3dc63e7507f");
  db.put({
    _id: data._id,
    _rev: data._rev,
    name: "orange",
  });
}

main();
