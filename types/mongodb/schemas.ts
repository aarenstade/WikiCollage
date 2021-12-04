import { now, ObjectId, Schema } from "mongoose";

export interface TopicItem {
  _id?: ObjectId;
  topic: string;
  description?: string;
  wikipedia_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdditionItem {
  _id?: ObjectId;
  url: string;
  topic_id?: ObjectId;
  creator: string;
  description?: string;
  timestamp: Date;
}

export const TopicSchema = new Schema({
  topic: { type: String, required: true },
  description: { type: String, required: false },
  wikipedia_url: { type: String, required: false },
  created_at: { type: Date, default: now() },
  updated_at: { type: Date, default: now() },
});

export const AdditionSchema = new Schema({
  url: { type: String, required: true },
  topic_id: { type: String, required: true },
  creator: { type: String, required: true },
  description: { type: String, required: false },
  timestamp: { type: Date, default: now() },
});