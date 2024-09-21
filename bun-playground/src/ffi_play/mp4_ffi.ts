import { cc, ptr } from "bun:ffi";
import { basename, extname, join } from "path";

console.time(`Compile ./mp4.c`);
const {
  symbols: { convert_file_to_mp4 },
} = cc({
  source: "./mp4.c",
  library: ["c", "avcodec", "swscale", "avformat"],
  symbols: {
    convert_file_to_mp4: {
      returns: "int",
      args: ["cstring", "cstring"],
    },
  },
});
console.timeEnd(`Compile ./mp4.c`);
// const outname = join(
//   process.cwd(),
//   basename(process.argv.at(2), extname(process.argv.at(2))) + ".mp4"
// );
// const input = Buffer.from(process.argv.at(2) + "\0");
// const output = Buffer.from(outname + "\0");
console.log(convert_file_to_mp4);
