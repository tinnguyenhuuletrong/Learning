import zlib from "zlib";

export async function deflate(inbuf: Buffer) {
  return new Promise((resolve, reject) => {
    zlib.deflate(inbuf, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
