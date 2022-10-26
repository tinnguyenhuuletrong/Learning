export interface IFileSourceReader {
  sizeInBytes(): Promise<number>;
  readToBuffer(offset: number, len: number): Promise<Buffer>;
}
