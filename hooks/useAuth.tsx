import { useEtherBalance, useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { useFirebaseContext } from "../services/FirebaseAuthProvider";
import { FirebaseAuth, GlobalRoles } from "../types/auth";

interface AuthHook {
  firebase: FirebaseAuth | null;
  eth: { account: string | null | undefined; balance: any };
  role: GlobalRoles;
}

const useAuth = (): AuthHook => {
  const firebase = useFirebaseContext();
  const { account } = useEthers();
  const balance = useEtherBalance(account);
  const [role, setRole] = useState<GlobalRoles>(GlobalRoles.view);

  useEffect(() => {
    // TODO, restrict editing to only connected wallets
    // if (firebase?.user && acccount)
    if (firebase?.user) {
      setRole(GlobalRoles.edit);
    } else {
      setRole(GlobalRoles.view);
    }
  }, [firebase?.user]);

  return { firebase, eth: { account, balance }, role };
};

export default useAuth;
