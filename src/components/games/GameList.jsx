import { useEffect, useState } from "react";
import { FaPen, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../modal/Modal";
import { modalFunc } from "../../redux/modalSlice";

const GameList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userPathId = location.pathname.split("/")[2];
  const gamesRef = collection(db, "games");
  const [games, setGames] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const modal = useSelector((state) => state.modal.modal);
  const [filterValue, setFilterValue] = useState("gameDate");

  const [gameInfo, setGameInfo] = useState({
    name: "",
    gamePhoto: "",
    score: "0",
    platform: "",
    date: "",
    review: "",
    gameStatus: "Bitirildi",
    gameTotalTime: "",
    dateEnd: "",
  });
  useEffect(() => {
    const fieldToOrderBy =
      filterValue === "oyun"
        ? "gameName"
        : filterValue === "puan"
        ? "gameScore"
        : filterValue === "platform"
        ? "gamePlatform"
        : filterValue === "ss"
        ? "screenshots"
        : filterValue === "başlangıç tarihi"
        ? "gameDate"
        : filterValue === "durum"
        ? "gameStatus"
        : filterValue === "inceleme"
        ? "gameReview"
        : "gameDate";

    const sortOrder = filterValue.charAt(0) === "-" ? "desc" : "asc";

    console.log(filterValue);
    const querryMessages = query(
      gamesRef,
      where("userId", "==", userPathId),
      orderBy(fieldToOrderBy, sortOrder)
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
  }, [filterValue]);

  const filterDatas = (e) => {
    const clickedValue = e.target.innerText.toLowerCase();
    setFilterValue((prevFilterValue) => {
      if (clickedValue === "oyun") {
        return prevFilterValue === "gameName" ? "-gameName" : "gameName";
      }
      if (clickedValue === "puan") {
        return prevFilterValue === "gameScore" ? "-gameScore" : "gameScore";
      }
      if (clickedValue === "platform") {
        return prevFilterValue === "gamePlatform"
          ? "-gamePlatform"
          : "gamePlatform";
      }
      if (clickedValue === "ss") {
        return prevFilterValue === "screenshots"
          ? "-screenshots"
          : "screenshots";
      }
      if (clickedValue === "başlangiç tarihi") {
        return prevFilterValue === "gameDate" ? "-gameDate" : "gameDate";
      }
      if (clickedValue === "durum") {
        return prevFilterValue === "gameStatus" ? "-gameStatus" : "gameStatus";
      }
      if (clickedValue === "i̇nceleme") {
        return prevFilterValue === "gameReview" ? "-gameReview" : "gameReview";
      }
      return prevFilterValue;
    });
  };

  const editGameInfo = (index) => {
    dispatch(modalFunc());
    setGameInfo({
      name: games[index].gameName,
      gamePhoto: games[index].gamePhoto,
      score: games[index].gameScore,
      platform: games[index].gamePlatform,
      date: games[index].gameDate,
      review: games[index].gameReview,
      gameStatus: games[index].gameStatus,
      gameTotalTime: games[index].gameTotalTime,
      dateEnd: games[index].dateEnd,
    });
    navigate(`?edit=${games[index].id}`);
  };

  console.log(filterValue);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div>
        {modal && <Modal setGameInfo={setGameInfo} gameInfo={gameInfo}></Modal>}
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
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={(e) => filterDatas(e)}
            >
              <span className="flex items-center space-x-10">
                Oyun
                {filterValue === "gameName" ? (
                  <FaSortDown size={15} />
                ) : filterValue === "-gameName" ? (
                  <FaSortUp size={15} />
                ) : (
                  <FaSort size={15} />
                )}
              </span>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={(e) => filterDatas(e)}
            >
              <span className="flex items-center space-x-10">
                Puan
                {filterValue === "gameScore" ? (
                  <FaSortDown size={15} />
                ) : filterValue === "-gameScore" ? (
                  <FaSortUp size={15} />
                ) : (
                  <FaSort size={15} />
                )}
              </span>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={(e) => filterDatas(e)}
            >
              <span className="flex items-center space-x-10">
                Platform{" "}
                {filterValue === "gamePlatform" ? (
                  <FaSortDown size={15} />
                ) : filterValue === "-gamePlatform" ? (
                  <FaSortUp size={15} />
                ) : (
                  <FaSort size={15} />
                )}
              </span>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={(e) => filterDatas(e)}
            >
              <span className="flex items-center space-x-10">
                SS{" "}
                {filterValue === "screenshots" ? (
                  <FaSortDown size={15} />
                ) : filterValue === "-screenshots" ? (
                  <FaSortUp size={15} />
                ) : (
                  <FaSort size={15} />
                )}
              </span>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={(e) => filterDatas(e)}
            >
              <span className="flex items-center space-x-10">
                Başlangıç Tarihi{" "}
                {filterValue === "gameDate" ? (
                  <FaSortDown size={15} />
                ) : filterValue === "-gameDate" ? (
                  <FaSortUp size={15} />
                ) : (
                  <FaSort size={15} />
                )}
              </span>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={(e) => filterDatas(e)}
            >
              <span className="flex items-center space-x-10">
                Durum
                {filterValue === "gameStatus" ? (
                  <FaSortDown size={15} />
                ) : filterValue === "-gameStatus" ? (
                  <FaSortUp size={15} />
                ) : (
                  <FaSort size={15} />
                )}
              </span>
            </th>
            <th
              scope="col"
              className="px-6 py-3 cursor-pointer"
              onClick={(e) => filterDatas(e)}
            >
              <span className="flex items-center space-x-10">
                İnceleme
                {filterValue === "gameReview" ? (
                  <FaSortDown size={15} />
                ) : filterValue === "-gameReview" ? (
                  <FaSortUp size={15} />
                ) : (
                  <FaSort size={15} />
                )}
              </span>
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
                {game.gamePhoto === "" ? (
                  <img
                    src={"../../../public/logo.png"}
                    alt="Oyun"
                    className="object-cover w-16 h-16 rounded-full"
                  />
                ) : (
                  <img
                    src={game.gamePhoto}
                    alt="Geçersiz Fotoğraf Url"
                    className="object-cover w-16 h-16 rounded-full"
                  />
                )}
              </td>

              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <Link
                  to={`/user/${userPathId}/game/${game.id}`}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {game.gameName}
                </Link>
              </th>
              <td className="px-6 py-4">{game.gameScore}/10</td>
              <td className="px-6 py-4">{game.gamePlatform}</td>
              <td className="px-6 py-4">
                {game.screenshots ? game.screenshots.length : "0"}
              </td>
              <td className="px-6 py-4">
                {game.gameDate ? game.gameDate : "-"}
              </td>
              <td className="px-6 py-4">{game.gameStatus}</td>

              <td className="px-6 py-4 relative">
                {game.gameReview}
                {token && JSON.parse(token).uid === userPathId && (
                  <FaPen
                    className="absolute top-3 right-3 cursor-pointer hover:text-blue-600"
                    onClick={() => editGameInfo(index)}
                  ></FaPen>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameList;
