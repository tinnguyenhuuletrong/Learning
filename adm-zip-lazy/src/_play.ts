import path from "path";
import fs from "fs";
import { LazyZipFileReader, IFileSourceReader } from "./";

const PATH = path.join(__dirname, "../samples/info.zip");
// const PATH = path.join(__dirname, "../samples/wrong.zip");
// const PATH = path.join(__dirname, "../samples/hasFolder.zip");

class FileSystemSourceSync implements IFileSourceReader {
  constructor(public fileName: string) {}

  async sizeInBytes() {
    const stats = fs.statSync(this.fileName);
    const sizeInBytes = stats.size;
    return sizeInBytes;
  }
  async readToBuffer(offset: number, len: number) {
    const buff = Buffer.alloc(len);
    const fh = fs.openSync(this.fileName, "r");
    fs.readSync(fh, buff, 0, len, offset);

    fs.closeSync(fh);
    return buff;
  }
}

async function main() {
  const source = new FileSystemSourceSync(PATH);
  const ins = await LazyZipFileReader.fromSource(source);
  await ins.fetchEntries(source);

  console.log(ins.header.toJSON());
  console.log(ins.zipEntries);

  const kybInfoEntry = ins.zipEntries.find(
    (itm) => itm.fileName === "kybInfo.json"
  );
  const dataBuf = await kybInfoEntry.getData(source);
  console.log("kybInfo.json", dataBuf.toString());
}

main();
