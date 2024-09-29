import { join } from "path";
import {
  createMergeableStore,
  type MergeableChanges,
} from "tinybase/with-schemas";
import { createFilePersister } from "tinybase/persisters/persister-file";

async function createStore(storeName: string) {
  const store = createMergeableStore(storeName)
    .setValuesSchema({
      "me.userId": { type: "string" },
      "me.userName": { type: "string" },
      "me.displayName": { type: "string" },
    })
    .setTablesSchema({
      userProfile: {
        id: { type: "string" },
        displayName: { type: "string" },
        userName: { type: "string" },
        lastActiveAt: { type: "number" },
      },
    });

  return store;
}

async function client_01() {
  const store = await createStore("store_01");
  const persister = createFilePersister(
    store as any,
    join(__dirname, "../tmp/store_01.json"),
    console.log
  );

  type M = ReturnType<(typeof store)["getTransactionMergeableChanges"]>;
  const changes: M[] = [];

  store.addWillFinishTransactionListener(() => {
    const tmp = store.getTransactionMergeableChanges();
    console.log("onTransaction: isChanged", tmp[2]);
    changes.push(tmp);
  });

  await persister.load([
    {},
    {
      "me.userId": "u1",
      "me.userName": "user1",
      "me.displayName": "User 1",
    },
  ]);

  const id = `u${Math.round(Math.random() * 100)}`;

  store.setRow("userProfile", id, {
    id: id,
    displayName: `User ${id}`,
    userName: `user${id}`,
    lastActiveAt: Date.now(),
  });

  console.log("keyValues", store.getValueIds());
  console.log("rowIds", store.getRowIds("userProfile"));

  console.log("end contentHash: ", store.getMergeableContentHashes());
  await persister.save();

  return { store, changes };
}

async function client_02() {
  const store = await createStore("store_02");
  return { store };
}

async function main() {
  const c01 = await client_01();
  const c02 = await client_02();

  for (const itm of c01.changes) {
    c02.store.applyMergeableChanges(itm);
    console.log("apply change", itm);
  }
  console.log(c02.store.getContent());
}
main();
