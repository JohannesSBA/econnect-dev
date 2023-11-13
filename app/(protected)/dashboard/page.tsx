import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import SignOutButton from "../components/SignOutButton";

const App = ({ Component, pageProps }: AppProps) => {
  return <SignOutButton />;
};

export default App;
