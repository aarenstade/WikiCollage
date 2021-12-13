import fs from "fs";
import request from "request";

export const writeImageFile = async (
  data: string | Buffer | ArrayBuffer,
  path: string
): Promise<void> => {
  if (typeof data === "string") {
    return new Promise((resolve, reject) => {
      request(data)
        .pipe(fs.createWriteStream(path))
        .on("close", resolve)
        .on("error", reject);
    });
  } else {
    fs.appendFileSync(path, Buffer.from(data));
  }
};
