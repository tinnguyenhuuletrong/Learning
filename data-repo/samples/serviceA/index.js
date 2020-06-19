const DataRepo = require("../../src");
const App = require("../base/App");
const UserDomain = require("./UserDomain");

async function main() {
  const app = new App("serviceA$");
  await app.start();
  const usrDomainIns = new UserDomain(app.getVorpal());
  const userRepoIns = await DataRepo.createDataRepo({
    topic: "UserDomain",
    dataSource: usrDomainIns,
  });
  await app.addDataRepo("UserDomain", userRepoIns);

  app.showCLI();
}

main();
