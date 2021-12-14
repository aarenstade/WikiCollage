/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/dist/client/router";
import { BASE_URL } from "../../config";
import SearchBar from "./SearchBar";
import useCollage from "../../hooks/useCollage";
import styles from "./Navbar.module.css";
import Link from "next/link";
import WalletBar from "./WalletBar";

const Navbar = () => {
  const router = useRouter();
  const collage = useCollage();

  const handleSearch = (topic: string) => {
    collage.setLoading(true);
    router.push(`/t/${topic}`);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.menu}>
        <img
          src="/images/logo-small.png"
          alt="WikiCollage"
          width={160}
          className={styles.logo}
          onClick={() => router.push("/")}
        />
        <Link href="/about">About</Link>
      </div>
      <div style={{ display: "flex", gap: 0, justifyContent: "flex-end", alignItems: "center" }}>
        <WalletBar />
        <SearchBar
          topic={collage.topic?.topic}
          loading={collage.loading}
          onSearch={(topic: string) => handleSearch(topic)}
        />
      </div>
    </div>
  );
};

export default Navbar;
