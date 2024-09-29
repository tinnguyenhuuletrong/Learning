// https://automerge.org/automerge/api-docs/js/

import type { SyncMessage } from "@automerge/automerge";
import { next as automerge } from "@automerge/automerge";

type DocType = { ideas: Array<string> };

let doc1 = automerge.from<DocType>({ ideas: [] });
let head = automerge.getHeads(doc1);
console.log("0: ", JSON.stringify(doc1.ideas), "-", head);

doc1 = automerge.change(doc1, (d) => {
  d.ideas.push("an immutable document");
});

head = automerge.getHeads(doc1);
const state_0 = automerge.save(doc1);
console.log("1: ", JSON.stringify(doc1.ideas), "-", head);
// console.log("state:", state_0);

doc1 = automerge.change(doc1, (d) => {
  d.ideas.push("new document");
  d.ideas.push(`new document - created at: ${new Date()}`);
});
const state_1 = automerge.saveSince(doc1, head);
head = automerge.getHeads(doc1);
console.log("2: ", JSON.stringify(doc1.ideas), "-", head);

const state_2 = automerge.saveSince(doc1, head);
console.log("state_2: ", state_2);

let syncState1 = automerge.initSyncState();
let syncMsg;
[syncState1, syncMsg] = automerge.generateSyncMessage(doc1, syncState1);

// peer 2
{
  console.log("---------------------");
  console.log("another plannet");
  console.log("---------------------");
  let doc2 = automerge.init<DocType>();
  let syncState2 = automerge.initSyncState();
  if (!syncMsg) throw new Error("OoO");
  [doc2, syncState2] = automerge.receiveSyncMessage<DocType>(
    doc2,
    syncState2,
    syncMsg
  );
  [syncState2, syncMsg] = automerge.generateSyncMessage(doc2, syncState2);

  {
    if (!syncMsg) throw new Error("OoO");
    [doc1, syncState1] = automerge.receiveSyncMessage(
      doc1,
      syncState1,
      syncMsg
    );

    [syncState1, syncMsg] = automerge.generateSyncMessage(doc1, syncState1);
  }

  if (!syncMsg) throw new Error("OoO");
  [doc2, syncState2] = automerge.receiveSyncMessage<DocType>(
    doc2,
    syncState2,
    syncMsg
  );

  console.log(JSON.stringify(doc2.ideas), "-", automerge.getHeads(doc2));
}
