import { parseArgs } from "util";
import path from "path";
import fs from "fs";
import * as automerge from "@automerge/automerge/next";

type StorageIndex = {
  docPath: string;
  sizeInBytes: number;
  heads: automerge.Heads;
};

type Ctx = {
  storageRootPath: string;
  doc?: DocumentEntity;
  _lastStorageIndex?: StorageIndex;
};

type DocShape = { value: string };
class DocumentEntity {
  amDoc!: automerge.Doc<DocShape>;

  constructor(snapshot?: Uint8Array) {
    if (snapshot) this.amDoc = automerge.load<DocShape>(snapshot);
    else {
      this.amDoc = automerge.init<DocShape>();
      this.amDoc = automerge.change(
        this.amDoc,
        "init",
        (d) => (d.value = "default content. update me!")
      );
    }
  }

  change(message: string, fn: automerge.ChangeFn<DocShape>) {
    this.amDoc = automerge.change(this.amDoc, message, fn);
  }

  get value() {
    return automerge.toJS(this.amDoc);
  }

  get heads() {
    return automerge.getHeads(this.amDoc);
  }

  snapshot() {
    const currentVal = this.value;
    const prevHead = this.heads.join(",");
    this.amDoc = automerge.init();
    this.change(`s:${prevHead}`, (d) => {
      d.value = currentVal.value;
    });
  }
}

async function startup() {
  const { values } = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options: {
      peerName: {
        type: "string",
        default: "peer_1",
      },
    },
  });

  console.info("Context:", { values });
  const { peerName = "default" } = values;

  const DIR = path.join(__dirname, "../tmp/", peerName);
  await _ensureDir(DIR);

  let ctx: Ctx = {
    storageRootPath: DIR,
  };
  await _loadFromDir(ctx);
  if (!ctx.doc) {
    ctx.doc = new DocumentEntity();
  }

  return { ctx };
}

async function cliFrontEnd(ctx: Ctx) {
  if (!ctx.doc) {
    return;
  }

  const usage = `
  /stats | /show       print state as json
  /sync | /save        sync to storage. Keep histories
  /set <val>           set document value to <val>
  /snapshot            sync to storage. Truncate all histories
  /load                load from storage
  /diff                diff with last saved
  `;
  console.log(`🤟 Wellcome to git-like document. powered by automerge 🤟`);
  console.log(usage);

  type cmdType =
    | "/stats"
    | "/show"
    | "/set"
    | "/sync"
    | "/save"
    | "/load"
    | "/diff"
    | "/snapshot";

  for await (const line of console) {
    const tmp = line.trim().split(" ");
    const cmd = tmp[0] as cmdType;
    const args = tmp.slice(1);

    switch (cmd) {
      case "/stats":
      case "/show":
        {
          const val = automerge.toJS(ctx.doc.amDoc).value;
          const heads = automerge.getHeads(ctx.doc.amDoc);
          const history = automerge
            .getHistory(ctx.doc.amDoc)
            .reverse()
            .map((itm) => {
              return {
                change: {
                  hash: itm.change.hash,
                  message: itm.change.message,
                  at: itm.change.time,
                },
                snapshot: itm.snapshot.value,
              };
            });
          console.dir({ val, heads, history }, { depth: 10 });
        }
        break;

      case "/set":
        {
          const newVal = args.join(" ");
          ctx.doc.change(`messate at -${Date.now()}`, (d) => {
            d.value = newVal;
          });
          console.log(`${ctx.doc.value.value} - ${ctx.doc.heads}`);
        }
        break;

      case "/save":
      case "/sync": {
        await _syncToDir(ctx);
        console.log("Dump and Flush to dir:", ctx.storageRootPath);
        break;
      }

      case "/diff":
        {
          if (!ctx._lastStorageIndex) {
            console.error(`_lastStorageIndex not exists`);
            break;
          }
          const tmp = automerge.diff(
            ctx.doc.amDoc,
            ctx._lastStorageIndex?.heads,
            ctx.doc.heads
          );
          console.dir(tmp, { depth: 10 });
        }
        break;

      case "/load": {
        await _loadFromDir(ctx);
        console.log("loaded from dir:", ctx.storageRootPath);
        break;
      }

      case "/snapshot": {
        ctx.doc.snapshot();
        await _syncToDir(ctx);
        console.log("Snapshot and Flush to dir:", ctx.storageRootPath);
        break;
      }
      default: {
        console.warn("unknown cmd", cmd);
        console.log(usage);
      }
    }
  }
}

async function main() {
  const { ctx } = await startup();
  await cliFrontEnd(ctx);
}

main();

async function _saveDoc(doc: DocumentEntity) {
  return automerge.save(doc.amDoc);
}

async function _syncToDir(ctx: Ctx) {
  if (!ctx.doc) return;
  const dbPath = path.join(ctx.storageRootPath, "db.json");

  const docName = "data";
  const docSavePath = path.join(ctx.storageRootPath, `${docName}.bin`);

  const data = await _saveDoc(ctx.doc);

  const indexObj: StorageIndex = {
    docPath: docSavePath,
    sizeInBytes: data.length,
    heads: ctx.doc.heads,
  };
  fs.writeFileSync(docSavePath, data);
  fs.writeFileSync(dbPath, JSON.stringify(indexObj, null, " "));

  ctx._lastStorageIndex = indexObj;
}

async function _loadFromDir(ctx: Ctx) {
  const dbPath = path.join(ctx.storageRootPath, "db.json");

  if (!fs.existsSync(dbPath)) return false;

  try {
    const indexObj: StorageIndex = JSON.parse(
      fs.readFileSync(dbPath).toString()
    );
    const data = fs.readFileSync(indexObj.docPath);
    ctx.doc = new DocumentEntity(new Uint8Array(data));
    ctx._lastStorageIndex = indexObj;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function _ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p);
}
