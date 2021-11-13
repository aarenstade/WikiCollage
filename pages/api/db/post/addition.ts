import withDatabase from "../../../../server/middleware/database";
import { NextApiRequest, NextApiResponse } from "next";
import { Addition, Topic } from "../../../../types/models";
import { AdditionItem, TopicItem } from "../../../../types/schemas";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
};

export default withDatabase(handler);
