import { AdditionItem, TopicItem } from "./schemas";

export interface Collage {
  addition: AdditionItem | null;
  topic: TopicItem | null;
  loading: boolean;
}

export interface CollageHistory {
  prev_additions: AdditionItem[] | null;
  topic_history: TopicItem[] | null;
  page: number;
}
