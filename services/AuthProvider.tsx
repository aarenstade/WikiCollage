import { useEffect, useState, createContext, useContext, FC } from "react";
import { signInAnonymously, User } from "firebase/auth";
import { auth } from "../client/firebase";

interface AuthContextValue {
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleFirebaseAuthError = (e: string) => {
    setUser(null);
    if (e === "auth/weak-password") {
      alert("Choose stronger password...");
    } else if (e === "auth/email-already-in-use") {
      alert("Email already in use...");
    } else {
      alert("Error creating account...");
    }
  };

  const handleUser = async (user: User | null) => {
    if (user) {
      const token = await user.getIdToken();
      setUser(user);
      setToken(token);
    }
  };

  // handle automatic sign in
  useEffect(() => {
    if (!user) {
      signInAnonymously(auth)
        .then((cred) => handleUser(cred.user))
        .catch(handleFirebaseAuthError);
    } else {
      const changeSubscription = auth.onIdTokenChanged(handleUser);
      return () => changeSubscription();
    }
  }, []);

  // refresh token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return { user, token };
};

const AuthProvider: FC = ({ children }) => {
  const auth: AuthContextValue = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue | null => useContext(AuthContext);

export default AuthProvider;
