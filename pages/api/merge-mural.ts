import fs from "fs";
import { v4 } from "uuid";
import { ADMIN_ST } from "../../server/firebase";
import { writeImageFile } from "../../server/utils";
import sharp, { OverlayOptions } from "sharp";
import { NextApiRequest, NextApiResponse } from "next";

const emptyCollageUri =
  "https://firebasestorage.googleapis.com/v0/b/visual-collab.appspot.com/o/empty-collage.png?alt=media&token=76160648-0897-481a-95e9-68ab5960f604";

const mergeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const elements = req.body.elements;
    const collage = req.body.collage;
    const compositeElements: OverlayOptions[] = [];

    console.log({ elements });
    console.log({ collage });

    // download images and build list object for sharp composite
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const path = `/tmp/${v4()}.png`;
      await writeImageFile(element.uri, path);

      compositeElements.push({
        input: path,
        gravity: "northwest",
        top: element.y,
        left: element.x,
      });
    }
    const muralPath = `/tmp/base_collage.png`;
    const newMuralPath = "/tmp/new_collage.png";
    const emptyCollagePath = "/tmp/empty_collage.png";

    // composite elements
    if (collage) {
      // prev collage exists
      await writeImageFile(collage, muralPath);
      await sharp(muralPath).composite(compositeElements).toFile(newMuralPath);
    } else {
      // create blank square and embed
      await writeImageFile(emptyCollageUri, emptyCollagePath);
      await sharp(emptyCollagePath).composite(compositeElements).toFile(newMuralPath);
    }

    console.log("elements composited");

    // upload new mural
    const storagePath = `murals/mural_${v4()}.png`;
    await ADMIN_ST.upload(newMuralPath, { destination: storagePath });

    // delete all image files
    for (let i = 0; i < compositeElements.length; i++) {
      const path = compositeElements[i].input;
      if (path && typeof path === "string") fs.rmSync(path);
    }

    if (!collage) fs.rmSync(emptyCollagePath);

    console.log({ storagePath });
    // return storagePath
    res.status(200).send(storagePath);
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
};

export default mergeHandler;
