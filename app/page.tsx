import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
