import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../modal/Modal";
import { modalFunc } from "../../redux/modalSlice";
import GamesTableThComp from "./GamesTableThComp";
import { gameListThElements } from "../../utils/GameListThElements";
import ReactLoading from "react-loading";

const GameList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userPathId = location.pathname.split("/")[2];
  const gamesRef = collection(db, "games");
  const [games, setGames] = useState([]);
  const [filterValue, setFilterValue] = useState("-gameDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const token = useSelector((state) => state.auth.token);
  const modal = useSelector((state) => state.modal.modal);
  const [user, setUser] = useState({});
  //prettier-ignore
  const [gameInfo, setGameInfo] = useState({ name: "", gamePhoto: "", score: 0, platform: "Steam", date: "", review: "", gameStatus: "Bitirildi", gameTotalTime: ""});
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

  const fetchUser = async () => {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);
    const foundUser = querySnapshot.docs.find((doc) => doc.data().uid === userPathId);
    setUser(foundUser.data());
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    let fieldToOrderBy;
    switch (filterValue) {
      case "gameName":
        fieldToOrderBy = "gameName";
        break;
      case "gameScore":
        fieldToOrderBy = "gameScore";
        break;
      case "gamePlatform":
        fieldToOrderBy = "gamePlatform";
        break;
      case "screenshots":
        fieldToOrderBy = "screenshots";
        break;
      case "gameTotalTime":
        fieldToOrderBy = "gameTotalTime";
        break;
      case "gameDate":
        fieldToOrderBy = "gameDate";
        break;
      case "gameStatus":
        fieldToOrderBy = "gameStatus";
        break;
      default:
        fieldToOrderBy = filterValue.slice(1);
    }
    setSortOrder(filterValue.charAt(0) === "-" ? "desc" : "asc");

    const querryMessages = query(gamesRef, where("userId", "==", userPathId), orderBy(fieldToOrderBy, sortOrder));
    const unsuscribe = onSnapshot(querryMessages, (snapshot) => {
      const updatedGames = [];
      snapshot.forEach((doc) => {
        updatedGames.push({ ...doc.data(), id: doc.id });
      });
      setGames(updatedGames);
    });
    return () => unsuscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue, location, sortOrder]);

  const filterDatas = (e) => {
    const clickedValue = e.target?.innerText;
    if (clickedValue) {
      const lowerClickedValue = clickedValue.toLowerCase();
      setFilterValue((prevFilterValue) => {
        if (lowerClickedValue === "oyun") {
          return prevFilterValue === "gameName" ? "-gameName" : "gameName";
        }
        if (lowerClickedValue === "puan") {
          return prevFilterValue === "gameScore" ? "-gameScore" : "gameScore";
        }
        if (lowerClickedValue === "platform") {
          return prevFilterValue === "gamePlatform" ? "-gamePlatform" : "gamePlatform";
        }
        if (lowerClickedValue === "ss") {
          return prevFilterValue === "screenshots" ? "-screenshots" : "screenshots";
        }
        if (lowerClickedValue === "saat") {
          return prevFilterValue === "gameTotalTime" ? "-gameTotalTime" : "gameTotalTime";
        }
        if (lowerClickedValue === "son oynama") {
          return prevFilterValue === "gameDate" ? "-gameDate" : "gameDate";
        }
        if (lowerClickedValue === "durum") {
          return prevFilterValue === "gameStatus" ? "-gameStatus" : "gameStatus";
        }
        return prevFilterValue;
      });
    }
  };

  if (games.length === 0) {
    return <ReactLoading className="mx-auto w-full" type="spinningBubbles" height={375} width={375} />;
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div>{modal && <Modal setGameInfo={setGameInfo} gameInfo={gameInfo}></Modal>}</div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-xl font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Oyunlar
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            <strong>{user.name}</strong> tarafından oynanılan tüm oyunlar
          </p>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            {gameListThElements.map((elementInfo, i) => (
              <GamesTableThComp
                filterDatas={filterDatas}
                filterValue={filterValue}
                key={i}
                elementInfo={elementInfo}
              ></GamesTableThComp>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
              <td className="px-4 py-4">
                <Link to={`/user/${userPathId}/game/${game.id}`}>
                  {game.gamePhoto === "" ? (
                    <img
                      src={"../../../public/logo.png"}
                      alt="Oyun"
                      className="object-contain w-16 h-16 rounded-full"
                    />
                  ) : (
                    <img
                      src={game.gamePhoto}
                      alt="Geçersiz Fotoğraf Url"
                      className="object-cover w-16 h-16 rounded-full"
                    />
                  )}
                </Link>
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <Link to={`/user/${userPathId}/game/${game.id}`} className="hover:text-blue-600 cursor-pointer">
                  {game.gameName}
                </Link>
              </th>
              <td className="px-6 py-4">{game.gameScore}/10</td>
              <td className="px-6 py-4">{game.gamePlatform}</td>
              <td className="px-6 py-4">{game.screenshots ? game.screenshots.length : "0"}</td>
              <td className="px-6 py-4">{game.gameTotalTime ? game.gameTotalTime : "-"}</td>
              <td className="px-6 py-4">{game.gameDate ? game.gameDate : "-"}</td>
              <td className="px-6 py-4 relative">
                {game.gameStatus}{" "}
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
