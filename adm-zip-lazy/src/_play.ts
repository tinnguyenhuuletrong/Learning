import path from "path";
import fs from "fs";
import { LazyZipFileReader, IFileSourceReader } from "./";
import { Storage, File } from "@google-cloud/storage";

const PATH = path.join(__dirname, "../samples/info.zip");
// const PATH = path.join(__dirname, "../samples/wrong.zip");
// const PATH = path.join(__dirname, "../samples/hasFolder.zip");

class FileSystemSourceSync implements IFileSourceReader {
  constructor(public fileName: string) {}

  async sizeInBytes() {
    const stats = fs.statSync(this.fileName);
    const sizeInBytes = stats.size;
    console.log("[FileSystemSourceSync] size: ", sizeInBytes);
    return sizeInBytes;
  }
  async readToBuffer(offset: number, len: number) {
    const buff = Buffer.alloc(len);
    const fh = fs.openSync(this.fileName, "r");
    fs.readSync(fh, buff, 0, len, offset);

    fs.closeSync(fh);
    console.log(
      "[FileSystemSourceSync] seek: ",
      offset,
      len,
      "->",
      buff.length
    );

    return buff;
  }
}

class GCSSource implements IFileSourceReader {
  fileHandler: File;
  constructor(readonly uri: URL) {}

  private _parseUri(uri: URL) {
    let tmp = uri.pathname;
    if (tmp.startsWith("/")) tmp = tmp.slice(1);
    const bucketName = uri.host;
    const fileName = tmp.split("/").pop();
    return {
      bucketName,
      filePath: tmp,
      fileName,
    };
  }

  private async _load() {
    if (this.fileHandler) return;
    const storage = new Storage();
    const fileInfo = this._parseUri(this.uri);
    this.fileHandler = storage
      .bucket(fileInfo.bucketName)
      .file(fileInfo.filePath);
  }

  async sizeInBytes() {
    await this._load();

    const [meta] = await this.fileHandler.getMetadata();
    const size = parseInt(meta.size);
    console.log("[GCSSource] size: ", size);
    return parseInt(meta.size);
  }
  async readToBuffer(offset: number, len: number): Promise<Buffer> {
    await this._load();

    const downloadRes = await this.fileHandler.download({
      start: offset,
      end: offset + len - 1,
    });

    const buff = downloadRes[0];

    console.log("[GCSSource] seek: ", offset, len, "->", buff.length);

    return downloadRes[0];
  }
}

async function main() {
  // await withLocalFile();
  await withGCS();
}

main();

async function withGCS() {
  const source = new GCSSource(new URL(String(process.env["GCS_URI"])));

  const ins = await LazyZipFileReader.fromSource(source);
  await ins.fetchEntries(source);

  console.log(ins.header);
  console.log(ins.zipEntries);

  const kybInfoEntry = ins.zipEntries.find(
    (itm) => itm.fileName === "kybInfo.json"
  );
  const dataBuf = await kybInfoEntry?.getData(source);
  console.log("kybInfo.json", dataBuf?.toString());
}

async function withLocalFile() {
  const source = new FileSystemSourceSync(PATH);
  const ins = await LazyZipFileReader.fromSource(source);
  await ins.fetchEntries(source);

  console.log(ins.header);
  console.log(ins.zipEntries);

  const kybInfoEntry = ins.zipEntries.find(
    (itm) => itm.fileName === "kybInfo.json"
  );
  const dataBuf = await kybInfoEntry?.getData(source);
  console.log("kybInfo.json", dataBuf?.toString());
}
