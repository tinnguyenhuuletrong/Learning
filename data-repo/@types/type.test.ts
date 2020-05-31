import datarepo, { Repo, RepoRemote, IDataStore } from "./index";

async function main() {
  const a = new datarepo.storage.FileStore();
  const b = await datarepo.createRpcClient();
}
