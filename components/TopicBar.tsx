import { VFC } from "react";
import { TopicItem } from "../types/mongodb/schemas";
import styles from "./TopicBar.module.css";

interface TopicBarProps {
  topic: TopicItem;
}

// TODO query count of previous additions
// TODO add buttons to view topic history (popup dialog)
// TODO add in editable field to enter wikipedia url (parse to verify its a valid wikipedia url)

const TopicBar: VFC<TopicBarProps> = ({ topic }) => {
  return (
    <div className={styles.topicBar}>
      <p>Topic: {topic.topic}</p>
    </div>
  );
};

export default TopicBar;
