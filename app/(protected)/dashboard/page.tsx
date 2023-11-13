import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import SignOutButton from "../components/SignOutButton";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="h-screen w-screen bg-red-200">
      <SignOutButton />
    </div>
  );
};

export default App;
