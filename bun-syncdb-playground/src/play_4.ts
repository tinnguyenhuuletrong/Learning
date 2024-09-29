// https://automerge.org/automerge-repo/modules/_automerge_automerge_repo.html

import { join } from "path";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { DocHandle, Repo } from "@automerge/automerge-repo";
import { NodeFSStorageAdapter } from "@automerge/automerge-repo-storage-nodefs";

const PID = "p1";
const TMP_DIR = join(__dirname, "../tmp/play_4", PID);
const SAVE_PATH = join(TMP_DIR, "_cache.json");
type DocType = {
  todos: Array<{
    title: string;
    createdAt: number;
  }>;
};
type SaveStateType = {
  activeDocId?: string;
};

// simulate local storage
async function loadLocalStorage(): Promise<SaveStateType> {
  if (existsSync(SAVE_PATH))
    return JSON.parse(readFileSync(SAVE_PATH).toString());
  return {};
}
async function saveLocalStorage(storage: SaveStateType) {
  writeFileSync(SAVE_PATH, JSON.stringify(storage));
}

async function main() {
  const peerLocalStorage = await loadLocalStorage();
  const repo = new Repo({
    storage: new NodeFSStorageAdapter(TMP_DIR),
  });

  let handle: DocHandle<DocType>;
  if (!peerLocalStorage.activeDocId) {
    console.log("create new one");
    handle = repo.create<DocType>({ todos: [] });
    peerLocalStorage.activeDocId = handle.documentId;
  } else {
    handle = repo.find(peerLocalStorage.activeDocId as any);
    await handle.whenReady();
  }

  let state = await handle.doc();
  console.log("current state:", JSON.stringify(state));

  handle.change((d) =>
    d.todos.push({
      title: `${(Math.random() * 1000).toString(36)}`,
      createdAt: Date.now(),
    })
  );

  state = await handle.doc();
  console.log("next state:", JSON.stringify(state));

  await repo.flush();
  saveLocalStorage(peerLocalStorage);
}

main();
