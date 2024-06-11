import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { FC } from "react";

const Page: FC<AppProps> = ({ Component, pageProps: { session, ...rest } }) => {
  return (
    <SessionProvider session={session}>
      {session ? <Component {...rest} /> : <div>Loading...</div>}
    </SessionProvider>
  );
};

export default Page;
