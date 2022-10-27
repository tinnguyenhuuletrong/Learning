import Constants from "../common/constants";
import Errors from "../common/errors";
import { IFileSourceReader } from "../common/interfaces";
import Utils from "../common/utils";
import { EntryHeader } from "./EntryHeader";

export class MainHeader {
  _volumeEntries = 0;
  _totalEntries = 0;
  _size = 0;
  _offset = 0;
  _commentLength = 0;
  _headerStartOffset = 0;

  get diskEntries() {
    return this._volumeEntries;
  }
  set diskEntries(/*Number*/ val) {
    this._volumeEntries = this._totalEntries = val;
  }

  get totalEntries() {
    return this._totalEntries;
  }
  set totalEntries(/*Number*/ val) {
    this._totalEntries = this._volumeEntries = val;
  }

  get size() {
    return this._size;
  }
  set size(/*Number*/ val) {
    this._size = val;
  }

  get offset() {
    return this._offset;
  }
  set offset(/*Number*/ val: number) {
    this._offset = val;
  }

  get commentLength() {
    return this._commentLength;
  }
  set commentLength(/*Number*/ val) {
    this._commentLength = val;
  }

  get mainHeaderSize() {
    return Constants.ENDHDR + this._commentLength;
  }

  loadFromBinary(/*Buffer*/ data: Buffer) {
    // data should be 22 bytes and start with "PK 05 06"
    // or be 56+ bytes and start with "PK 06 06" for Zip64
    if (
      (data.length !== Constants.ENDHDR ||
        data.readUInt32LE(0) !== Constants.ENDSIG) &&
      (data.length < Constants.ZIP64HDR ||
        data.readUInt32LE(0) !== Constants.ZIP64SIG)
    ) {
      throw new Error(Errors.INVALID_END);
    }

    if (data.readUInt32LE(0) === Constants.ENDSIG) {
      // number of entries on this volume
      this._volumeEntries = data.readUInt16LE(Constants.ENDSUB);
      // total number of entries
      this._totalEntries = data.readUInt16LE(Constants.ENDTOT);
      // central directory size in bytes
      this._size = data.readUInt32LE(Constants.ENDSIZ);
      // offset of first CEN header
      this._offset = data.readUInt32LE(Constants.ENDOFF);
      // zip file comment length
      this._commentLength = data.readUInt16LE(Constants.ENDCOM);
    } else {
      // number of entries on this volume
      this._volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB);
      // total number of entries
      this._totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT);
      // central directory size in bytes
      this._size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZE);
      // offset of first CEN header
      this._offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF);

      this._commentLength = 0;
    }
  }

  toBinary() {
    var b = Buffer.alloc(Constants.ENDHDR + this._commentLength);
    // "PK 05 06" signature
    b.writeUInt32LE(Constants.ENDSIG, 0);
    b.writeUInt32LE(0, 4);
    // number of entries on this volume
    b.writeUInt16LE(this._volumeEntries, Constants.ENDSUB);
    // total number of entries
    b.writeUInt16LE(this._totalEntries, Constants.ENDTOT);
    // central directory size in bytes
    b.writeUInt32LE(this._size, Constants.ENDSIZ);
    // offset of first CEN header
    b.writeUInt32LE(this._offset, Constants.ENDOFF);
    // zip file comment length
    b.writeUInt16LE(this._commentLength, Constants.ENDCOM);
    // fill comment memory with spaces so no garbage is left there
    b.fill(" ", Constants.ENDHDR);

    return b;
  }

  toJSON() {
    // creates 0x0000 style output
    const offset = function (nr, len) {
      let offs = nr.toString(16).toUpperCase();
      while (offs.length < len) offs = "0" + offs;
      return "0x" + offs;
    };

    return {
      diskEntries: this._volumeEntries,
      totalEntries: this._totalEntries,
      size: this._size + " bytes",
      offset: offset(this._offset, 4),
      commentLength: this._commentLength,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, "\t");
  }

  static calculateOffset(stats: { sizeInBytes: number }) {
    return {
      offset: stats.sizeInBytes - Constants.ENDHDR,
      length: Constants.ENDHDR,
    };
  }

  static async fromSource(source: IFileSourceReader) {
    const sizeInBytes = await source.sizeInBytes();
    const headerChunk = MainHeader.calculateOffset({ sizeInBytes });
    const headerBuffer = await source.readToBuffer(
      headerChunk.offset,
      headerChunk.length
    );
    const ins = MainHeader.fromHeaderBuffer(headerBuffer);
    ins._headerStartOffset = headerChunk.offset;
    return ins;
  }

  static fromHeaderBuffer(inBuffer: Buffer) {
    var i = 0, // END header size
      max = Math.max(0, i - 0xffff), // 0xFFFF is the max zip file comment length
      n = max,
      endStart = inBuffer.length,
      endOffset = -1, // Start offset of the END header
      commentEnd = 0;

    for (i; i >= n; i--) {
      if (inBuffer[i] !== 0x50) continue; // quick check that the byte is 'P'
      if (inBuffer.readUInt32LE(i) === Constants.ENDSIG) {
        // "PK\005\006"
        endOffset = i;
        commentEnd = i;
        endStart = i + Constants.ENDHDR;
        // We already found a regular signature, let's look just a bit further to check if there's any zip64 signature
        n = i - Constants.END64HDR;
        continue;
      }

      if (inBuffer.readUInt32LE(i) === Constants.END64SIG) {
        // Found a zip64 signature, let's continue reading the whole zip64 record
        n = max;
        continue;
      }

      if (inBuffer.readUInt32LE(i) === Constants.ZIP64SIG) {
        // Found the zip64 record, let's determine it's size
        endOffset = i;
        endStart =
          i +
          Utils.readBigUInt64LE(inBuffer, i + Constants.ZIP64SIZE) +
          Constants.ZIP64LEAD;
        break;
      }
    }

    if (!~endOffset) throw new Error(Errors.INVALID_FORMAT);

    const mainHeader = new MainHeader();
    mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart));
    return mainHeader;
  }
}
