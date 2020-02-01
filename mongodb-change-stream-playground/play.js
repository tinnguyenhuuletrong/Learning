const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const assert = require("assert");

// Connection URL
const uri = `mongodb://localhost/play`;

// Use connect method to connect to the Server

async function main() {
  const client = await connectToMongodb(uri);

  console.log("Connected correctly to server");

  const db = client.db();

  const collection = db.collection("items");

  // await collection.insert({ name: "apple", stock: 10 });

  // Head
  const changeStream = collection.watch();

  // Resume After - Specific ID
  // LIMIT: https://docs.mongodb.com/manual/changeStreams/#resumeafter-for-change-streams

  // const lastId = {
  //   _data:
  //     "825E359043000000012B022C0100296E5A100427D92284CAC5429CB753A4CA3C7A239946645F696400645E3590437F63FC1F520E0BD50004"
  // };
  // const changeStream = collection.watch({
  //   resumeAfter: lastId
  // });

  changeStream.on("change", next => {
    console.log("next", next);
  });

  // Iterator
  //const next = await changeStream.next();
}

main();

async function connectToMongodb(uri) {
  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true
  });
  return client;
}

// Sample
/*
next { _id:
   { _data:
      '825E358D92000000012B022C0100296E5A100427D92284CAC5429CB753A4CA3C7A239946645F696400645E358D7594377B1E392DFDC30004' },
  operationType: 'replace',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1580567954 },
  fullDocument: { _id: 5e358d7594377b1e392dfdc3, name: 'apple', stock: 11 },
  ns: { db: 'play', coll: 'items' },
  documentKey: { _id: 5e358d7594377b1e392dfdc3 } }

next { _id:
   { _data:
      '825E358DF2000000012B022C0100296E5A100427D92284CAC5429CB753A4CA3C7A239946645F696400645E358DF22D0ECE547118B5D00004' },
  operationType: 'insert',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1580568050 },
  fullDocument: { _id: 5e358df22d0ece547118b5d0, name: 'orange', stock: 1 },
  ns: { db: 'play', coll: 'items' },
  documentKey: { _id: 5e358df22d0ece547118b5d0 } }

next { _id:
   { _data:
      '825E358E0A000000012B022C0100296E5A100427D92284CAC5429CB753A4CA3C7A239946645F696400645E358DF22D0ECE547118B5D00004' },
  operationType: 'delete',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1580568074 },
  ns: { db: 'play', coll: 'items' },
  documentKey: { _id: 5e358df22d0ece547118b5d0 } }
*/
