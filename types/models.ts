import { model, models, Model } from "mongoose";
import { AdditionItem, AdditionSchema, TopicItem, TopicSchema } from "./schemas";

export const Addition: Model<AdditionItem> = models.Addition || model("Addition", AdditionSchema);
export const Topic: Model<TopicItem> = models.Topic || model("Topic", TopicSchema);
