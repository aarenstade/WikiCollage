import { useEffect, useState, createContext, FC, useContext } from "react";
import { signInAnonymously, User } from "firebase/auth";
import { FirebaseAuth } from "../types/auth";
import { auth } from "../client/firebase";

export const FirebaseAuthContext = createContext<FirebaseAuth | null>(null);

const useFirebaseAuth = (): FirebaseAuth => {
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
      console.log("got user");
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

const FirebaseAuthProvider: FC = ({ children }) => {
  const firebase: FirebaseAuth = useFirebaseAuth();

  return (
    <FirebaseAuthContext.Provider value={{ user: firebase.user, token: firebase.token }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
export const useFirebaseContext = () => useContext<FirebaseAuth | null>(FirebaseAuthContext);

export default FirebaseAuthProvider;
