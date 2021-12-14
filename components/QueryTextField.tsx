import { ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState, VFC } from "react";
import { authGetRequest } from "../client/requests";
import useAuth from "../hooks/useAuth";
import { capitalizeWords, encodeTopicUrlParam } from "../utils/utils";
import styles from "./QueryTextField.module.css";

interface QueryTextFieldProps {
  endpointUrl: string;
  paramName: string;
  value?: string;
  selectOnEnter?: boolean;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
}

const QueryTextField: VFC<QueryTextFieldProps> = ({
  endpointUrl,
  paramName,
  value,
  selectOnEnter,
  onChange,
  onSelect,
}) => {
  const auth = useAuth();
  const [results, setResults] = useState<string[]>([]);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (auth.firebase?.token && value && focus) {
        setResults([]);
        authGetRequest(auth.firebase.token, `${endpointUrl}?${paramName}=${encodeTopicUrlParam(value)}`)
          .then((res) => {
            if (res.data.results) setResults(res.data.results);
          })
          .catch((err) => console.error({ err }));
      }
    }, 500);
  }, [auth.firebase?.token, focus, endpointUrl, paramName, value]);

  const selectResult = (i: number) => onSelect(results[i]);

  return (
    <div className={styles.queryTextField}>
      <div className={styles.queryInputUlStack}>
        <input
          onFocus={() => setFocus(true)}
          type="text"
          name="query-text-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value && selectOnEnter && onSelect(value)}
          autoComplete="off"
          onBlur={() =>
            setTimeout(() => {
              setResults([]);
              setFocus(false);
            }, 200)
          }
        />
        <ul className={styles.queryResultUl}>
          {results.map((result: string, i: number) => (
            <li onClick={() => selectResult(i)} key={i}>
              {capitalizeWords(result)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QueryTextField;
