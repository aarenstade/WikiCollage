import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../server/api-middleware";

import { Addition, Topic } from "../../../types/models";
import { AdditionItem, TopicItem } from "../../../types/schemas";

const handler = apiHandler();

// fetch paginated additions
// INPUT --> ?topic_id={String}&limit={Number}&page={Number}
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const topic_id = req.query.topic_id.toString();
    const limit = parseInt(req.query.limit.toString());
    const page = parseInt(req.query.page.toString());

    const additions = await Addition.find()
      .where({ topic_id })
      .sort({ timestamp: "desc" })
      .limit(limit)
      .skip(page * limit)
      .lean();

    if (additions.length > 0) {
      if (additions.length > 1) {
        res.status(200).send(additions);
      } else {
        res.status(200).send({ ...additions[0] });
      }
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
});

// handle insertion of new addition, inserting topic if does not exist
// INPUT --> body: {addition {AdditionItem}, topic?: {TopicItem}}
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const addition: AdditionItem = req.body.addition;
    console.log({ addition });
    if (addition.topic_id) {
      // existing topic
      const additionInsert = await new Addition(addition).save();
      if (additionInsert.errors) res.status(500).send(JSON.stringify(additionInsert.errors));
      res.status(200).send({ _id: additionInsert._id });
    } else {
      // new topic
      let topicData: TopicItem = req.body.topic;
      const topicInsert = await new Topic(topicData).save();
      console.log({ topicInsert });

      if (topicInsert._id) {
        const additionInsert = await new Addition({ ...addition, topic_id: topicInsert._id }).save();
        if (additionInsert.errors) res.status(500).send(JSON.stringify(additionInsert.errors));
        console.log({ additionInsert });
        res.status(200).send({ _id: additionInsert._id });
      } else {
        res.status(500).send("Error inserting topic...");
      }
    }
  } catch (error) {
    console.error({ error });
    res.status(500).send(error);
  }
});

export default handler;
