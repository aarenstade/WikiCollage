import { ChangeEvent, KeyboardEventHandler, useEffect, useState, VFC } from "react";
import { HOME_TOPIC_NAME } from "../../config";
import styles from "./SearchBar.module.css";

interface Props {
  topic?: string;
  onSearch: (topic: string) => void;
}

const SearchBar: VFC<Props> = ({ topic, onSearch }) => {
  const [newTopic, setTopic] = useState(topic);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTopic(e.target.value);
  };

  useEffect(() => {
    if (!topic || topic === HOME_TOPIC_NAME) {
      setTopic("");
    } else {
      setTopic(topic);
    }
  }, [topic]);

  return (
    <div className={styles.searchBar}>
      <input
        value={newTopic}
        type="text"
        name="topic"
        placeholder="Search"
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && newTopic != topic && onSearch(newTopic || "")}
      />
      <button onClick={() => newTopic && newTopic != topic && onSearch(newTopic)}>Search</button>
    </div>
  );
};

export default SearchBar;
