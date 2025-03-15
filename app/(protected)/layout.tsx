"use client";

import { UserProvider } from "./components/functionComponents/UserContext";
import { SessionProvider } from "next-auth/react";

function App({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>{children}</UserProvider>
    </SessionProvider>
  );
}

export default App;
