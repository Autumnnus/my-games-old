import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPen } from "react-icons/fa";
import { db } from "../../config/firebaseConfig";
import { modalFunc, toggleSSModal, togglefullSSModal } from "../../redux/modalSlice";
import ScreenShotModal from "../modal/ScreenShotModal";
import ImageModal from "../modal/ImageModal";
import Modal from "../modal/Modal";
import ReactLoading from "react-loading";
import CircleRightComp from "../CircleRightComp";

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
    gameTotalTime: null,
    dateEnd: "",
  });

  const [showMore, setShowMore] = useState(false);
  const text = gameData?.data.gameReview;
  const shouldShowButton = text && text.length > 520;
  const displayedText = showMore ? text : text ? text.slice(0, 520) : "";

  // ...

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
      const foundTheGame = gamesArray.find((game) => game.id === location.pathname.split("/")[4]);
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
    return <ReactLoading className="mx-auto w-full" type="spinningBubbles" height={375} width={375} />;
  }
  return (
    <div className="sm:container mx-auto mt-8">
      {fullSSModal && <ImageModal imgModalUrl={imgModalUrl} imgModalName={imgModalName}></ImageModal>}
      {modal && <Modal setGameInfo={setGameInfo} gameInfo={gameInfo}></Modal>}
      <div className="flex flex-col lg:flex-row text-white">
        <div className="flex-shrink-0 md:w-1/4">
          {gameData.data.gamePhoto === "" ? (
            <img
              src="https://s22908.pcdn.co/wp-content/uploads/2023/07/most-hyped-up-games.jpg"
              alt=""
              className="rounded-lg object-cover lg:h-auto h-96 w-96"
            />
          ) : (
            <img src={gameData.data.gamePhoto} alt="Geçersiz Url" className="rounded-lg object-cover h-96 w-96" />
          )}
        </div>
        <div className="lg:flex flex-col justify-center px-4 lg:ml-8 lg:w-full mt-4 lg:mt-0">
          <div className="lg:flex justify-between items-center mb-3">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">{gameData.data?.gameName}</h2>
            {token && JSON.parse(token).uid === userPathId && (
              <div className="flex space-x-4 mt-2">
                <button
                  className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-500 duration-500"
                  onClick={editGameInfo}
                >
                  Düzenle
                </button>
                {ssModal ? (
                  <ScreenShotModal setSSInfo={setSSInfo} ssInfo={ssInfo}></ScreenShotModal>
                ) : (
                  <button
                    className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-500 duration-500"
                    onClick={openSSModal}
                  >
                    Ekran Görüntüsü Ekle
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <p className="mr-4">
              <span className="font-bold">Platform: </span>
              <span className="text-gray-400">{gameData.data?.gamePlatform}</span>
            </p>
            <p>
              <span className="font-bold">Puan: </span>
              <span className="text-gray-400">{gameData.data?.gameScore}/10</span>
            </p>
            <p>
              <span className="font-bold">Oyun durumu: </span>
              <span className="text-gray-400">{gameData.data?.gameStatus}</span>
            </p>
            <p>
              <span className="font-bold">Toplam Oynama Saati: </span>
              <span className="text-gray-400">{gameData.data?.gameTotalTime}</span>
            </p>
            <p>
              <span className="font-bold">Son Oynama Tarihi: </span>
              <span className="text-gray-400">{gameData.data?.gameDate}</span>
            </p>

            <p className="text-white mb-6">
              <span className="font-bold">İnceleme: </span>
              <span className="text-gray-400">{displayedText}</span>

              {shouldShowButton && (
                <button className="text-blue-500 hover:underline" onClick={() => setShowMore(!showMore)}>
                  {showMore ? "Daha Az Göster" : "Daha Fazla Göster"}
                </button>
              )}
            </p>
          </div>
          <div className="absolute top-0 right-0 z-[-1] opacity-30 lg:opacity-100">
            <CircleRightComp />
          </div>
        </div>
      </div>
      {gameData.data.screenshots.length !== 0 && (
        <h3 className="text-2xl font-semibold mb-4 text-white mt-8">
          Ekran Görüntüleri <span>({gameData.data.screenshots.length})</span>
        </h3>
      )}
      {!fullSSModal && !ssModal && gameData.data.screenshots && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {gameData.data.screenshots
              .slice()
              .reverse()
              .map((screenshot, index, array) => (
                <div key={array.length - 1 - index} className="relative mb-4 group">
                  <img
                    src={screenshot.ssUrl}
                    alt="Geçersiz Url"
                    className="rounded-lg max-h-56 w-full group-hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                    onClick={() => openImageModal(screenshot.ssUrl, screenshot.ssName)}
                  />

                  {screenshot.ssName && (
                    <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                      {screenshot.ssName}
                    </p>
                  )}
                  {token && JSON.parse(token).uid === userPathId && (
                    <FaPen
                      className="absolute top-3 right-3 cursor-pointer text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-600 rounded-md p-1 hover:bg-slate-500"
                      size={22}
                      onClick={() => editSSInfo(array.length - 1 - index)}
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
