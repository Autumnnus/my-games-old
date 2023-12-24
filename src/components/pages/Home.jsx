import { useSelector } from "react-redux";
import GameList from "../games/GameList";

const Home = () => {
  const auth = useSelector((state) => state.auth);
  console.log(auth);
  return (
    <div>
      <GameList></GameList>
    </div>
  );
};

export default Home;
