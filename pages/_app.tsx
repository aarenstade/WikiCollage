import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import AuthProvider from "../services/FirebaseAuthProvider";
import { DAppProvider } from "@usedapp/core";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DAppProvider config={{ autoConnect: true }}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </DAppProvider>
    </AuthProvider>
  );
}
export default MyApp;
