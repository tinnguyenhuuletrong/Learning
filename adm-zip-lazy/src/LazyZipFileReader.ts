import { IFileSourceReader } from "./common/interfaces";
import { EntryHeader } from "./headers/EntryHeader";
import { MainHeader } from "./headers/MainHeader";
import Constants from "./common/constants";
import Errors from "./common/errors";
import Utils from "./common/utils";
import * as Methods from "./methods";

export class LazyZipEntryReader {
  private _loaded = false;
  fileName: string = "";
  comment: string = "";
  isDirectory: boolean = false;
  constructor(readonly header: EntryHeader) {}

  loadMetadata(buff: Buffer) {
    let tmp = 0;
    tmp = this._parseFileName(buff, tmp);

    if (this.header.extraLength) {
      tmp = this._parseExtra(buff, tmp);
    }

    if (this.header.commentLength) {
      tmp = this._parseComment(buff, tmp);
    }

    this._loaded = true;
  }

  async getData(source: IFileSourceReader, pass?: string) {
    if (!this._loaded) throw new Error("please call loadMetadata first");
    if (this.isDirectory) return Buffer.alloc(0);

    let compressedData = await this._getCompressedDataFromZip(source);
    if (compressedData.length === 0) return Buffer.alloc(0);

    if (this.header.encrypted) {
      if (!pass) throw new Error("Password is missing");
      compressedData = Methods.decrypt(compressedData, this.header, pass);
    }

    const data = Buffer.alloc(this.header.size);
    switch (this.header.method) {
      case Constants.STORED:
        compressedData.copy(data);
        if (!this._crc32OK(data)) {
          throw new Error(Errors.BAD_CRC);
        } else {
          return data;
        }
      case Constants.DEFLATED:
        var inflater = await Methods.inflate(compressedData);
        inflater.copy(data, 0);
        return data;

      default:
        throw new Error(Errors.UNKNOWN_METHOD);
    }
  }

  private _parseFileName(buff: Buffer, offset: number) {
    const rawEntryName = buff.slice(
      offset,
      offset + this.header.fileNameLength
    );
    this.fileName = rawEntryName.toString();

    // check is directory
    const lastChar = rawEntryName[rawEntryName.length - 1];
    this.isDirectory = lastChar === 47 || lastChar === 92;

    offset += this.header.fileNameLength;
    return offset;
  }

  private _parseComment(buff: Buffer, offset: number) {
    const rawComment = buff.slice(offset, offset + this.header.commentLength);
    this.comment = rawComment.toString();

    offset += this.header.commentLength;
    return offset;
  }

  private _parseExtra(buff: Buffer, pointerOffset: number) {
    const data = buff.slice(
      pointerOffset,
      pointerOffset + this.header.extraLength
    );
    var offset = 0;
    let signature, size, part;
    while (offset < data.length) {
      signature = data.readUInt16LE(offset);
      offset += 2;
      size = data.readUInt16LE(offset);
      offset += 2;
      part = data.slice(offset, offset + size);
      offset += size;
      if (Constants.ID_ZIP64 === signature) {
        this._parseZip64ExtendedInformation(part);
      }
    }
    offset += this.header.extraLength;
    return offset;
  }

  private _parseZip64ExtendedInformation(data: Buffer) {
    var size: number,
      compressedSize: number,
      offset: number,
      diskNumStart: number;
    const _entryHeader = this.header;

    if (data.length >= Constants.EF_ZIP64_SCOMP) {
      size = Utils.readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
      if (_entryHeader.size === Constants.EF_ZIP64_OR_32) {
        _entryHeader.size = size;
      }
    }
    if (data.length >= Constants.EF_ZIP64_RHO) {
      compressedSize = Utils.readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
      if (_entryHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
        _entryHeader.compressedSize = compressedSize;
      }
    }
    if (data.length >= Constants.EF_ZIP64_DSN) {
      offset = Utils.readUInt64LE(data, Constants.EF_ZIP64_RHO);
      if (_entryHeader.offset === Constants.EF_ZIP64_OR_32) {
        _entryHeader.offset = offset;
      }
    }
    if (data.length >= Constants.EF_ZIP64_DSN + 4) {
      diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
      if (_entryHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
        _entryHeader.diskNumStart = diskNumStart;
      }
    }
  }

  private _crc32OK(data: Buffer | string) {
    // if bit 3 (0x08) of the general-purpose flags field is set, then the CRC-32 and file sizes are not known when the header is written
    if ((this.header.flags & 0x8) !== 0x8) {
      if (Utils.crc32(data) !== this.header.dataHeader.crc) {
        return false;
      }
    } else {
      // @TODO: load and check data descriptor header
      // The fields in the local header are filled with zero, and the CRC-32 and size are appended in a 12-byte structure
      // (optionally preceded by a 4-byte signature) immediately after the compressed data:
    }
    return true;
  }

  private async _getCompressedDataFromZip(source: IFileSourceReader) {
    // lazy load DataHeader
    if (Object.keys(this.header.dataHeader).length === 0) {
      const buff = await source.readToBuffer(
        this.header.offset,
        Constants.LOCHDR
      );
      this.header.loadDataHeaderFromBinary(buff);
    }

    const buff = await source.readToBuffer(
      this.header.realDataOffset,
      this.header.compressedSize
    );
    return buff;
  }
}

export class LazyZipFileReader {
  public zipEntries: LazyZipEntryReader[];

  constructor(readonly header: MainHeader) {}

  async fetchEntries(source: IFileSourceReader) {
    this.zipEntries = [];

    let index = this.header.offset;

    for (let i = 0; i < this.header.diskEntries; i++) {
      console.log(i);
      let tmp = index;
      const entryHeader = new EntryHeader();
      let buff = await source.readToBuffer(tmp, Constants.CENHDR);
      tmp += Constants.CENHDR;
      entryHeader.loadFromBinary(buff);

      const entryHeaderMetadataBuf = await source.readToBuffer(
        tmp,
        entryHeader.entryHeaderSize - Constants.CENHDR
      );

      const ins = new LazyZipEntryReader(entryHeader);
      ins.loadMetadata(entryHeaderMetadataBuf);

      index += entryHeader.entryHeaderSize;

      this.zipEntries.push(ins);
    }
    return this.zipEntries;
  }

  static async fromSource(source: IFileSourceReader) {
    const header = await MainHeader.fromSource(source);
    return new LazyZipFileReader(header);
  }
}
