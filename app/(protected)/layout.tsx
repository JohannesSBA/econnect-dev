import { UserProvider } from "./components/functionComponents/UserContext";

function App({ children, pageProps }: any) {
  return <UserProvider>{children}</UserProvider>;
}

export default App;
