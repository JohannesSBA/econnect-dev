import { AppProps } from "next/app";
import Posts from "../../components/Posts";

export const App = async () => {
  return (
    <div className="h-screen w-screen flex bg-white">
      <div className="w-1/3"></div>
      <Posts />
      <div className="w-1/3"></div>
    </div>
  );
};

export default App;
