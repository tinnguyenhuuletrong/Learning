import { sleep } from "bun";
import {
  createMergeableStore,
  getUniqueId,
  type Id,
  type MergeableStore,
} from "tinybase";
import { createCustomSynchronizer } from "tinybase/synchronizers";

const createBusSynchronizer = (
  id: Id,
  store: MergeableStore,
  localBus: any[],
  remoteBus: any[]
) => {
  let timer: Timer;
  const clientId = id;

  return createCustomSynchronizer(
    store,
    (toClientId, requestId, message, body) => {
      console.log(`[onSend]`, toClientId, requestId, message, body);
      // send
      remoteBus.push([clientId, requestId, message, body]);
    },
    (receive) => {
      // registerReceive
      timer = setInterval(() => {
        if (localBus.length > 0) {
          const [clientId, requestId, message, body] = localBus.shift();
          console.log(`[onRecv]`, clientId, requestId, message, body);
          receive(clientId, requestId, message, body);
        }
      }, 1);
    },
    () => clearInterval(timer), // destroy
    1
  );
};

async function main() {
  const bus1: any[] = [];
  const bus2: any[] = [];
  const store1 = createMergeableStore("store1");
  const store2 = createMergeableStore("store2");

  const synchronizer1 = createBusSynchronizer("store1", store1, bus1, bus2);
  const synchronizer2 = createBusSynchronizer("store2", store2, bus2, bus1);
  await synchronizer1.startSync();
  await synchronizer2.startSync();

  async function waitForSync() {
    while (synchronizer1.getStatus() !== 0 && synchronizer2.getStatus() !== 0) {
      console.log("------ wait ------");
      await sleep(10);
    }

    while (
      store1.getMergeableContentHashes()[0] !=
        store2.getMergeableContentHashes()[0] &&
      store1.getMergeableContentHashes()[1] !=
        store2.getMergeableContentHashes()[1]
    ) {
      console.log("------ wait hash same ------");
      await sleep(10);
    }
  }

  store1.transaction(() => {
    store1.setTables({ pets: { fido: { species: "dog" } } });
    store1.setValue("k1", "v1");
    store1.setValue("k2", "v2");
  });

  store2.transaction(() => {
    store2.setTables({ pets: { felix: { species: "cat" } } });
    store2.setValue("k3", "v3");
  });

  // wait for all finished
  await waitForSync();

  store2.transaction(() => {
    store2.setRow("pets", "ducky", { species: "duck" });
  });

  // wait for all finished
  await waitForSync();

  console.log("final store1", store1.getContent());
  console.log("final store2", store2.getContent());

  synchronizer1.destroy();
  synchronizer2.destroy();
}
main();
