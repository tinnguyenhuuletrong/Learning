import path from "path";
import fs from "fs";
import * as automerge from "@automerge/automerge/next";

const DIR = path.join(__dirname, "../tmp/git_like_repo");

type StorageIndex = {
  docPath: string;
  sizeInBytes: number;
};

type Ctx = {
  doc?: DocumentEntity;
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
  await _ensureDir(DIR);

  let ctx: Ctx = {};
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
  /test                test
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
    | "/test"
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
        console.log("Dump and Flush to dir:", DIR);
        break;
      }

      case "/load": {
        await _loadFromDir(ctx);
        console.log("loaded from dir:", DIR);
        break;
      }

      case "/snapshot": {
        ctx.doc.snapshot();
        await _syncToDir(ctx);
        console.log("Snapshot and Flush to dir:", DIR);
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
  const dbPath = path.join(DIR, "db.json");

  const docName = "data";
  const docSavePath = path.join(DIR, `${docName}.bin`);

  const data = await _saveDoc(ctx.doc);

  const indexObj: StorageIndex = {
    docPath: docSavePath,
    sizeInBytes: data.length,
  };
  fs.writeFileSync(docSavePath, data);
  fs.writeFileSync(dbPath, JSON.stringify(indexObj, null, " "));
}

async function _loadFromDir(ctx: Ctx) {
  const dbPath = path.join(DIR, "db.json");

  if (!fs.existsSync(dbPath)) return false;

  try {
    const indexObj: StorageIndex = JSON.parse(
      fs.readFileSync(dbPath).toString()
    );
    const data = fs.readFileSync(indexObj.docPath);
    ctx.doc = new DocumentEntity(new Uint8Array(data));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function _ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p);
}
