import { ChangeEvent, useEffect, useState, VFC } from "react";
import { HOME_TOPIC_NAME } from "../../config";
import styles from "./SearchBar.module.css";

import { IconButton } from "../Buttons";
import SearchIcon from "../icons/search.svg";

interface Props {
  topic?: string;
  loading: boolean;
  onSearch: (topic: string) => void;
}

const SearchBar: VFC<Props> = ({ topic, loading, onSearch }) => {
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
      {!loading && (
        <IconButton icon={<SearchIcon />} onClick={() => newTopic && newTopic != topic && onSearch(newTopic)} />
      )}
      {loading && <p style={{ margin: "4px" }}>...</p>}
    </div>
  );
};

export default SearchBar;
