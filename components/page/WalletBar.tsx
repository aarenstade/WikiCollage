import { useEtherBalance, useEthers } from "@usedapp/core";
import { VFC } from "react";
import styles from "./WalletBar.module.css";

const WalletBar: VFC = () => {
  const { account } = useEthers();
  const balance = useEtherBalance(account);
  const { activateBrowserWallet } = useEthers();

  if (account) {
    return (
      <div className={styles.walletBar}>
        <p>{balance?.toString().trimRight()}</p>
        <p>ETH</p>
        <p>{account.slice(0, 12)}...</p>
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.walletBar} ${styles.notConnected}`}
        onClick={() => activateBrowserWallet((err) => console.error({ err }))}
      >
        <p>Connect Your Wallet</p>
      </div>
    );
  }
};

export default WalletBar;
