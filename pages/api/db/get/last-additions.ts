import { NextApiRequest, NextApiResponse } from "next";
import withDatabase from "../../../../server/middleware/database";
import { Addition } from "../../../../types/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const topic_id = req.query.topic_id.toString();
    const limit = parseInt(req.query.limit.toString());
    const page = parseInt(req.query.page.toString());

    const additions = await Addition.find()
      .where({ topic_id: { $eq: topic_id } })
      .sort({ timestamp: "desc" })
      .limit(limit)
      .skip(page * limit);

    console.log({ additions });

    if (additions.length > 0) {
      res.status(200).send(additions);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
};

export default withDatabase(handler);
