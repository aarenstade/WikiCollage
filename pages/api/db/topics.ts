import { NextApiRequest, NextApiResponse } from "next";
import apiHandler from "../../../server/api-middleware";
import { Topic } from "../../../types/mongodb/models";
import { TopicItem } from "../../../types/mongodb/schemas";

const handler = apiHandler();
// fetch a single topic
// INPUT --> ?topic={String}
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const topic = req.query.topic.toString();
  const response: TopicItem | null = await Topic.findOne({ topic: { $regex: topic } });
  res.send(response);
});

export default handler;
