import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../server/api-middleware";

import { Addition, Topic } from "../../../types/mongodb/models";
import { AdditionItem, TopicItem } from "../../../types/mongodb/schemas";

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
    console.log("inserting new addition");
    const addition: AdditionItem = req.body.addition;
    let topic_id = addition.topic_id || "";

    if (!addition.topic_id) {
      const topic: TopicItem = req.body.topic;
      const topicInsert = await new Topic(topic).save();
      topic_id = topicInsert._id;
    }

    const newAddition = { ...addition, topic_id };
    const additionInsert = await new Addition(newAddition).save();
    if (additionInsert.errors) res.status(500).send(JSON.stringify(additionInsert.errors));

    res.status(200).send({ _id: additionInsert._id, topic_id: additionInsert.topic_id });
  } catch (error) {
    console.error({ error });
    res.status(500).send(null);
  }
});

export default handler;
