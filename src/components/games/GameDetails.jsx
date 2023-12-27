import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPen } from "react-icons/fa";
import { db } from "../../config/firebaseConfig";
import {
  modalFunc,
  toggleSSModal,
  togglefullSSModal,
} from "../../redux/modalSlice";
import ScreenShotModal from "../modal/ScreenShotModal";
import ImageModal from "../modal/ImageModal";
import Modal from "../modal/Modal";

const GameDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* Selectors
  const ssModal = useSelector((state) => state.modal.ssModal);
  const modal = useSelector((state) => state.modal.modal);
  const fullSSModal = useSelector((state) => state.modal.fullSSModal);
  const token = useSelector((state) => state.auth.token);
  //*States
  const [gameData, setGameData] = useState(null);
  const [imgModalUrl, setImgModalUrl] = useState(null);
  const [imgModalName, setImgModalName] = useState(null);
  const [ssInfo, setSSInfo] = useState({
    ssUrl: "",
    ssName: "",
  });
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

  const userPathId = location.pathname.split("/")[2];

  //* Functions
  useEffect(() => {
    const fetchTheGame = async () => {
      const gamesRef = collection(db, "games");
      const querySnapshot = await getDocs(gamesRef);
      const gamesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      const foundTheGame = gamesArray.find(
        (game) => game.id === location.pathname.split("/")[4]
      );
      setGameData(foundTheGame);
    };
    fetchTheGame();
  }, [location]);

  const openSSModal = () => {
    dispatch(toggleSSModal());
    navigate("?create=newSS");
  };

  const editSSInfo = (index) => {
    navigate(`?editSS=${gameData.data.screenshots[index].id}`);
    dispatch(toggleSSModal());
    setSSInfo({
      ssUrl: gameData.data.screenshots[index].ssUrl,
      ssName: gameData.data.screenshots[index].ssName,
    });
  };

  const openImageModal = (url, name) => {
    dispatch(togglefullSSModal());
    setImgModalUrl(url);
    setImgModalName(name);
  };
  const editGameInfo = () => {
    dispatch(modalFunc());
    setGameInfo({
      name: gameData?.data.gameName,
      gamePhoto: gameData?.data.gamePhoto,
      score: gameData?.data.gameScore,
      platform: gameData?.data.gamePlatform,
      date: gameData?.data.gameDate,
      review: gameData?.data.gameReview,
      gameStatus: gameData?.data.gameStatus,
      gameTotalTime: gameData?.data.gameTotalTime,
      dateEnd: gameData?.data.dateEnd,
    });
    navigate(`?edit=${gameData?.id}`);
  };

  if (!gameData) {
    return <div>Game not found</div>;
  }
  return (
    <div className="container mx-auto mt-8">
      <div className="flex items-center">
        <div className="">
          <img
            src={gameData.data.gamePhoto}
            alt={gameData.data.gameName}
            className="rounded-lg object-cover max-h-96 max-w-96"
          />
        </div>
        <div className="px-8">
          <h2 className="text-4xl font-bold mb-4">{gameData.data.gameName}</h2>
          <p className="text-gray-700 mb-6">
            <span className="font-bold">İnceleme: </span>
            {gameData.data.gameReview}
          </p>
          <div className="flex items-center text-gray-700">
            <span className="mr-4">
              <span className="font-bold">Platform: </span>{" "}
              {gameData.data.gamePlatform}
            </span>
            <span>
              <span className="font-bold">Score: </span>{" "}
              {gameData.data.gameScore}/10
            </span>
          </div>
        </div>
      </div>
      {ssModal ? (
        <ScreenShotModal
          setSSInfo={setSSInfo}
          ssInfo={ssInfo}
        ></ScreenShotModal>
      ) : (
        <button className="bg-gray-700 text-white p-2" onClick={openSSModal}>
          Ekle
        </button>
      )}
      <button className="bg-gray-700 text-white p-2" onClick={editGameInfo}>
        Düzenle
      </button>
      {fullSSModal && (
        <ImageModal
          imgModalUrl={imgModalUrl}
          imgModalName={imgModalName}
        ></ImageModal>
      )}
      {modal && <Modal setGameInfo={setGameInfo} gameInfo={gameInfo}></Modal>}

      {!fullSSModal && !ssModal && gameData.data.screenshots && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Screenshots</h3>

          <div className="grid grid-cols-3 gap-4">
            {gameData.data.screenshots.map((screenshot, index) => (
              <div key={index} className="relative mb-4 group">
                <img
                  src={screenshot.ssUrl}
                  alt="Geçersiz Url"
                  className="rounded-lg max-h-56 w-full group-hover:opacity-80 transition-opacity duration-300"
                  onClick={() =>
                    openImageModal(screenshot.ssUrl, screenshot.ssName)
                  }
                />

                {screenshot.ssName && (
                  <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    {screenshot.ssName}
                  </p>
                )}
                {token && JSON.parse(token).uid === userPathId && (
                  <FaPen
                    className="absolute top-3 right-3 cursor-pointer text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-600 rounded-md p-1"
                    size={22}
                    onClick={() => editSSInfo(index)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;
