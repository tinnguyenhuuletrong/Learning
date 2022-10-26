import zlib from "zlib";

export async function inflate(inbuf: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    zlib.inflate(inbuf, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
