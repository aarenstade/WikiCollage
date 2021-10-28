import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import fs from "fs";
import { v4 } from "uuid";

async function downloadImage(url: string, path: string) {
  const writer = fs.createWriteStream(path);
  const res = await axios({ url, responseType: "stream", method: "get" });
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

const imageToBase64Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const url = req.body.url.toString();
    const path = `/tmp/${v4()}.png`;
    await downloadImage(url.toString(), path);

    const buff = fs.readFileSync(path);
    const base64 = "data:image/png;base64," + buff.toString("base64");
    fs.rmSync(path);

    res.status(200).send(base64);
  } catch (error) {
    console.log({ error });
    res.status(500).send({ data: error });
  }
};

export default imageToBase64Handler;
