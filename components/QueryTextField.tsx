import { useEffect, useState, VFC } from "react";
import { authGetRequest } from "../client/requests";
import useAuth from "../hooks/useAuth";
import { encodeTopicUrlParam } from "../utils/utils";
import styles from "./QueryTextField.module.css";

interface QueryTextFieldProps {
  endpointUrl: string;
  paramName: string;
  onSelect: (v: string) => void;
}

const QueryTextField: VFC<QueryTextFieldProps> = ({ endpointUrl, paramName, onSelect }) => {
  const auth = useAuth();
  const [results, setResults] = useState<string[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (auth.firebase?.token && value) {
        authGetRequest(auth.firebase.token, `${endpointUrl}?${paramName}=${encodeTopicUrlParam(value)}`)
          .then((res) => {
            if (res.data.results) setResults(res.data.results);
          })
          .catch((err) => console.error({ err }));
      }
    }, 500);
  }, [auth.firebase?.token, endpointUrl, paramName, value]);

  return (
    <div className={styles.queryTextFieldContainer}>
      <input name="query-text-field" value={value} onChange={(e) => setValue(e.target.value)} />
      <ul className={styles.queryTextFieldResults}></ul>
    </div>
  );
};

export default QueryTextField;
