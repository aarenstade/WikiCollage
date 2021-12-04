import { AdditionItem, TopicItem } from "./mongodb/schemas";

export interface Collage {
  addition: AdditionItem | null;
  topic: TopicItem | null;
  open: boolean;
  loading: boolean;
}

export interface CollageHistory {
  prev_additions: AdditionItem[] | null;
  topic_history: TopicItem[] | null;
  page: number;
}
