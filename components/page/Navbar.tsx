import { useRouter } from "next/dist/client/router";
import { BASE_URL } from "../../config";
import SearchBar from "./SearchBar";
import useCollage from "../../hooks/useCollage";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const collage = useCollage();

  return (
    <div className={styles.navbar}>
      <h1>CollageWiki</h1>
      <SearchBar
        topic={collage.topic?.topic}
        onSearch={(topic: string) => router.push(`${topic ? `${BASE_URL}/t/${topic}` : `${BASE_URL}`}`)}
      />
    </div>
  );
};

export default Navbar;
