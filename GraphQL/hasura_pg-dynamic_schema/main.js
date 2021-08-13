const { Client } = require("pg");
const MigrateRunner = require("node-pg-migrate").default;

const DB_URI = "postgres://dbuser:dbpass@localhost:5432/dbuser";

async function main() {
  // await testConnect();
  await doMigrate();
}

async function testConnect() {
  const dbClient = new Client({
    connectionString: DB_URI,
  });

  await dbClient.connect();
  console.log("conneted");
}

async function doMigrate() {
  const res = await MigrateRunner({
    databaseUrl: DB_URI,
    schema: "ns_1",
    createSchema: true,
    createMigrationsSchema: true,
    direction: "up",

    // Down 1
    // direction: "down",
    // count: 1,
    // ---

    dir: "./migrations",
    migrationsTable: "_migrations",
  });

  console.log(res);
}

main();
