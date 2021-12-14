import { useEffect, useState, VFC } from "react";
import { BASE_URL, HOME_TOPIC_NAME } from "../../config";
import SearchIcon from "../icons/search.svg";
import QueryTextField from "../QueryTextField";
import { IconButton } from "../Buttons";
import styles from "./SearchBar.module.css";

interface Props {
  topic?: string;
  loading: boolean;
  onSearch: (topic: string) => void;
}

const SearchBar: VFC<Props> = ({ topic, loading, onSearch }) => {
  const [newTopic, setTopic] = useState(topic);

  useEffect(() => {
    if (!topic || topic === HOME_TOPIC_NAME) {
      setTopic("");
    } else {
      setTopic(topic);
    }
  }, [topic]);

  return (
    <div className={styles.searchBar}>
      <QueryTextField
        value={newTopic}
        onChange={(v) => setTopic(v)}
        onSelect={(v) => onSearch(v)}
        endpointUrl={`${BASE_URL}/api/db/topics`}
        paramName="search"
        selectOnEnter
      />
      {!loading && (
        <IconButton icon={<SearchIcon />} onClick={() => newTopic && newTopic != topic && onSearch(newTopic)} />
      )}
      {loading && <p style={{ margin: "4px" }}>...</p>}
    </div>
  );
};

export default SearchBar;
