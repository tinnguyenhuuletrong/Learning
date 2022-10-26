import Utils from "../common/utils";
import Constants from "../common/constants";
import Errors from "../common/errors";

/* The central directory file header */
export class EntryHeader {
  _verMade = 20; // v2.0
  _version = 10; // v1.0
  _flags = 0;
  _method = 0;
  _time = 0;
  _crc = 0;
  _compressedSize = 0;
  _size = 0;
  _fnameLen = 0;
  _extraLen = 0;
  _comLen = 0;
  _diskStart = 0;
  _inattr = 0;
  _attr = 0;
  _offset = 0;

  _dataHeader: any = {};

  _setTime(val) {
    val = new Date(val);
    this._time =
      (((val.getFullYear() - 1980) & 0x7f) << 25) | // b09-16 years from 1980
      ((val.getMonth() + 1) << 21) | // b05-08 month
      (val.getDate() << 16) | // b00-04 hour
      // 2 bytes time
      (val.getHours() << 11) | // b11-15 hour
      (val.getMinutes() << 5) | // b05-10 minute
      (val.getSeconds() >> 1); // b00-04 seconds divided by 2
  }

  constructor() {
    this._setTime(+new Date());
    this._verMade |= Utils.isWin ? 0x0a00 : 0x0300;
    // Set EFS flag since filename and comment fields are all by default encoded using UTF-8.
    // Without it file names may be corrupted for other apps when file names use unicode chars
    this._flags |= Constants.FLG_EFS;
  }

  get made() {
    return this._verMade;
  }
  set made(val) {
    this._verMade = val;
  }

  get version() {
    return this._version;
  }
  set version(val) {
    this._version = val;
  }

  get flags() {
    return this._flags;
  }
  set flags(val) {
    this._flags = val;
  }

  get method() {
    return this._method;
  }
  set method(val) {
    switch (val) {
      case Constants.STORED:
        this.version = 10;
      case Constants.DEFLATED:
      default:
        this.version = 20;
    }
    this._method = val;
  }

  get time() {
    return new Date(
      ((this._time >> 25) & 0x7f) + 1980,
      ((this._time >> 21) & 0x0f) - 1,
      (this._time >> 16) & 0x1f,
      (this._time >> 11) & 0x1f,
      (this._time >> 5) & 0x3f,
      (this._time & 0x1f) << 1
    );
  }
  set time(val) {
    this._setTime(val);
  }

  get crc() {
    return this._crc;
  }
  set crc(val) {
    this._crc = Math.max(0, val) >>> 0;
  }

  get compressedSize() {
    return this._compressedSize;
  }
  set compressedSize(val) {
    this._compressedSize = Math.max(0, val) >>> 0;
  }

  get size() {
    return this._size;
  }
  set size(val) {
    this._size = Math.max(0, val) >>> 0;
  }

  get fileNameLength() {
    return this._fnameLen;
  }
  set fileNameLength(val) {
    this._fnameLen = val;
  }

  get extraLength() {
    return this._extraLen;
  }
  set extraLength(val) {
    this._extraLen = val;
  }

  get commentLength() {
    return this._comLen;
  }
  set commentLength(val) {
    this._comLen = val;
  }

  get diskNumStart() {
    return this._diskStart;
  }
  set diskNumStart(val) {
    this._diskStart = Math.max(0, val) >>> 0;
  }

  get inAttr() {
    return this._inattr;
  }
  set inAttr(val) {
    this._inattr = Math.max(0, val) >>> 0;
  }

  get attr() {
    return this._attr;
  }
  set attr(val) {
    this._attr = Math.max(0, val) >>> 0;
  }

  // get Unix file permissions
  get fileAttr() {
    return this._attr ? (((this._attr >>> 0) | 0) >> 16) & 0xfff : 0;
  }

  get offset() {
    return this._offset;
  }
  set offset(val) {
    this._offset = Math.max(0, val) >>> 0;
  }

  get encrypted() {
    return (this._flags & 1) === 1;
  }

  get entryHeaderSize() {
    return Constants.CENHDR + this._fnameLen + this._extraLen + this._comLen;
  }

  get realDataOffset() {
    return (
      this._offset +
      Constants.LOCHDR +
      this._dataHeader.fnameLen +
      this._dataHeader.extraLen
    );
  }

  get dataHeader() {
    return this._dataHeader;
  }

  loadDataHeaderFromBinary(/*Buffer*/ data: Buffer) {
    // 30 bytes and should start with "PK\003\004"
    if (data.readUInt32LE(0) !== Constants.LOCSIG) {
      throw new Error(Errors.INVALID_LOC);
    }
    this._dataHeader = {
      // version needed to extract
      version: data.readUInt16LE(Constants.LOCVER),
      // general purpose bit flag
      flags: data.readUInt16LE(Constants.LOCFLG),
      // compression method
      method: data.readUInt16LE(Constants.LOCHOW),
      // modification time (2 bytes time, 2 bytes date)
      time: data.readUInt32LE(Constants.LOCTIM),
      // uncompressed file crc-32 value
      crc: data.readUInt32LE(Constants.LOCCRC),
      // compressed size
      compressedSize: data.readUInt32LE(Constants.LOCSIZ),
      // uncompressed size
      size: data.readUInt32LE(Constants.LOCLEN),
      // filename length
      fnameLen: data.readUInt16LE(Constants.LOCNAM),
      // extra field length
      extraLen: data.readUInt16LE(Constants.LOCEXT),
    };
  }

  loadFromBinary(/*Buffer*/ data: Buffer) {
    // data should be 46 bytes and start with "PK 01 02"
    if (
      data.length !== Constants.CENHDR ||
      data.readUInt32LE(0) !== Constants.CENSIG
    ) {
      throw new Error(Errors.INVALID_CEN);
    }
    // version made by
    this._verMade = data.readUInt16LE(Constants.CENVEM);
    // version needed to extract
    this._version = data.readUInt16LE(Constants.CENVER);
    // encrypt, decrypt flags
    this._flags = data.readUInt16LE(Constants.CENFLG);
    // compression method
    this._method = data.readUInt16LE(Constants.CENHOW);
    // modification time (2 bytes time, 2 bytes date)
    this._time = data.readUInt32LE(Constants.CENTIM);
    // uncompressed file crc-32 value
    this._crc = data.readUInt32LE(Constants.CENCRC);
    // compressed size
    this._compressedSize = data.readUInt32LE(Constants.CENSIZ);
    // uncompressed size
    this._size = data.readUInt32LE(Constants.CENLEN);
    // filename length
    this._fnameLen = data.readUInt16LE(Constants.CENNAM);
    // extra field length
    this._extraLen = data.readUInt16LE(Constants.CENEXT);
    // file comment length
    this._comLen = data.readUInt16LE(Constants.CENCOM);
    // volume number start
    this._diskStart = data.readUInt16LE(Constants.CENDSK);
    // internal file attributes
    this._inattr = data.readUInt16LE(Constants.CENATT);
    // external file attributes
    this._attr = data.readUInt32LE(Constants.CENATX);
    // LOC header offset
    this._offset = data.readUInt32LE(Constants.CENOFF);
  }

  dataHeaderToBinary() {
    // LOC header size (30 bytes)
    var data = Buffer.alloc(Constants.LOCHDR);
    // "PK\003\004"
    data.writeUInt32LE(Constants.LOCSIG, 0);
    // version needed to extract
    data.writeUInt16LE(this._version, Constants.LOCVER);
    // general purpose bit flag
    data.writeUInt16LE(this._flags, Constants.LOCFLG);
    // compression method
    data.writeUInt16LE(this._method, Constants.LOCHOW);
    // modification time (2 bytes time, 2 bytes date)
    data.writeUInt32LE(this._time, Constants.LOCTIM);
    // uncompressed file crc-32 value
    data.writeUInt32LE(this._crc, Constants.LOCCRC);
    // compressed size
    data.writeUInt32LE(this._compressedSize, Constants.LOCSIZ);
    // uncompressed size
    data.writeUInt32LE(this._size, Constants.LOCLEN);
    // filename length
    data.writeUInt16LE(this._fnameLen, Constants.LOCNAM);
    // extra field length
    data.writeUInt16LE(this._extraLen, Constants.LOCEXT);
    return data;
  }

  entryHeaderToBinary() {
    // CEN header size (46 bytes)
    var data = Buffer.alloc(
      Constants.CENHDR + this._fnameLen + this._extraLen + this._comLen
    );
    // "PK\001\002"
    data.writeUInt32LE(Constants.CENSIG, 0);
    // version made by
    data.writeUInt16LE(this._verMade, Constants.CENVEM);
    // version needed to extract
    data.writeUInt16LE(this._version, Constants.CENVER);
    // encrypt, decrypt flags
    data.writeUInt16LE(this._flags, Constants.CENFLG);
    // compression method
    data.writeUInt16LE(this._method, Constants.CENHOW);
    // modification time (2 bytes time, 2 bytes date)
    data.writeUInt32LE(this._time, Constants.CENTIM);
    // uncompressed file crc-32 value
    data.writeUInt32LE(this._crc, Constants.CENCRC);
    // compressed size
    data.writeUInt32LE(this._compressedSize, Constants.CENSIZ);
    // uncompressed size
    data.writeUInt32LE(this._size, Constants.CENLEN);
    // filename length
    data.writeUInt16LE(this._fnameLen, Constants.CENNAM);
    // extra field length
    data.writeUInt16LE(this._extraLen, Constants.CENEXT);
    // file comment length
    data.writeUInt16LE(this._comLen, Constants.CENCOM);
    // volume number start
    data.writeUInt16LE(this._diskStart, Constants.CENDSK);
    // internal file attributes
    data.writeUInt16LE(this._inattr, Constants.CENATT);
    // external file attributes
    data.writeUInt32LE(this._attr, Constants.CENATX);
    // LOC header offset
    data.writeUInt32LE(this._offset, Constants.CENOFF);
    // fill all with
    data.fill(0x00, Constants.CENHDR);
    return data;
  }

  toJSON() {
    const bytes = function (nr) {
      return nr + " bytes";
    };

    return {
      made: this._verMade,
      version: this._version,
      flags: this._flags,
      method: Utils.methodToString(this._method),
      time: this.time,
      crc: "0x" + this._crc.toString(16).toUpperCase(),
      compressedSize: bytes(this._compressedSize),
      size: bytes(this._size),
      fileNameLength: bytes(this._fnameLen),
      extraLength: bytes(this._extraLen),
      commentLength: bytes(this._comLen),
      diskNumStart: this._diskStart,
      inAttr: this._inattr,
      attr: this._attr,
      offset: this._offset,
      entryHeaderSize: bytes(
        Constants.CENHDR + this._fnameLen + this._extraLen + this._comLen
      ),
    };
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, "\t");
  }
}
