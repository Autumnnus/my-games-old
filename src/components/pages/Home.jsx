import { useSelector } from "react-redux";
import GameList from "../games/GameList";
import CreateNewGame from "../modal/CreateNewGame";

const Home = () => {
  const { modal } = useSelector((state) => state.modal);
  const auth = useSelector((state) => state.auth);
  console.log(auth);
  return (
    <div>{modal ? <CreateNewGame></CreateNewGame> : <GameList></GameList>}</div>
  );
};

export default Home;
