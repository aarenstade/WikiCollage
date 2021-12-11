import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import AuthProvider from "../services/FirebaseAuthProvider";
import { DAppProvider } from "@usedapp/core";
import Navbar from "../components/page/Navbar";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DAppProvider config={{ autoConnect: true }}>
        <RecoilRoot>
          <Head>
            <title>WikiCollage</title>
          </Head>
          <Navbar />
          <Component {...pageProps} />
        </RecoilRoot>
      </DAppProvider>
    </AuthProvider>
  );
}
export default MyApp;
