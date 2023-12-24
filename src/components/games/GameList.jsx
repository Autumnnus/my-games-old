import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import CreateNewGame from "../modal/CreateNewGame";
import { modalFunc } from "../../redux/modalSlice";

const GameList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gamesRef = collection(db, "games");
  const [games, setGames] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const modal = useSelector((state) => state.modal.modal);
  const [gameInfo, setGameInfo] = useState({
    name: "",
    gamePhoto: "",
    score: "0",
    platform: "",
    date: "",
    review: "",
  });
  useEffect(() => {
    const querryMessages = query(
      gamesRef,
      where("userId", "==", JSON.parse(token).uid),
      orderBy("gameName")
    );
    const unsuscribe = onSnapshot(querryMessages, (snapshot) => {
      const updatedGames = [];
      snapshot.forEach((doc) => {
        updatedGames.push({ ...doc.data(), id: doc.id });
      });
      setGames(updatedGames);
    });
    return () => unsuscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(gameInfo);

  const editGameInfo = (index) => {
    dispatch(modalFunc());
    setGameInfo({
      name: games[index].gameName,
      gamePhoto: games[index].gamePhoto,
      score: games[index].gameScore,
      platform: games[index].gamePlatform,
      date: games[index].gameDate,
      review: games[index].gameReview,
    });
    navigate(`?edit=${games[index].id}`);
  };
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div>
        {modal && (
          <CreateNewGame
            setGameInfo={setGameInfo}
            gameInfo={gameInfo}
          ></CreateNewGame>
        )}
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          2023
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            2023 yılı içerisinde oynadığım tüm oyunlar
          </p>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">
              Oyun
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Puan
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Platform
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              SS
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Başlangıç Tarihi
            </th>
            <th scope="col" className="px-6 py-3">
              İnceleme
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-4 py-4">
                <img
                  src={game.gamePhoto}
                  alt={game.gameName}
                  className="object-cover w-16 h-16 rounded-full"
                />
              </td>

              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <Link
                  onClick={() => navigate(game.id)}
                  to={`/game/${game.id}`}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {game.gameName}
                </Link>
              </th>
              <td className="px-6 py-4 text-center">{game.gameScore}/10</td>
              <td className="px-6 py-4 text-center">{game.gamePlatform}</td>
              <td className="px-6 py-4 text-center">
                {game.screenshoots ? game.screenshoots.length : "0"}
              </td>
              <td className="px-6 py-4 text-center">
                {game.gameDate ? game.gameDate : "-"}
              </td>

              <td className="px-6 py-4 relative">
                {game.gameReview}
                <FaPen
                  className="absolute top-3 right-3 cursor-pointer hover:text-blue-600"
                  onClick={() => editGameInfo(index)}
                ></FaPen>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameList;
