import fs from "fs";
import { promisify } from "util";
import ffmpeg from "fluent-ffmpeg";
import MemoryStream from "./memory-stream.js";

const VIDEO_PATH = "/Users/admin/Downloads/my_face.mp4";

const memoryStream = new MemoryStream();

ffmpeg(VIDEO_PATH).writeToStream(fs.createWriteStream("./my_face.mov"));
