import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import { modalFunc } from "../../redux/modalSlice";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { authFBConfig, db } from "../../config/firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import WarningModal from "./WarningModal";
import { useState } from "react";
const Modal = ({ setGameInfo, gameInfo }) => {
  Modal.propTypes = {
    setGameInfo: PropTypes.func.isRequired,
    gameInfo: PropTypes.shape({
      name: PropTypes.string,
      gamePhoto: PropTypes.string,
      score: PropTypes.string,
      platform: PropTypes.string,
      date: PropTypes.string,
      review: PropTypes.string,
      gameStatus: PropTypes.string,
      gameTotalTime: PropTypes.string,
    }).isRequired,
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const docId = location.search.split("=")[1];

  const [toggleWarningModal, setToggleWarningModal] = useState(false);

  const closeModal = () => {
    dispatch(modalFunc());
    navigate(location.pathname);
  };
  const onchangeFunc = (e) => {
    setGameInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadToFirestore = async () => {
    const querySearch = location.search.split("?")[1].split("=")[0];
    const gamesRef = collection(db, "games");
    const gameDocRef = doc(gamesRef, docId);
    const gamesQuery = query(gamesRef);
    const gamesSnapshot = await getDocs(gamesQuery);
    if (gamesSnapshot.empty) {
      await addDoc(gamesRef, {
        gameName: gameInfo.name,
        gamePhoto: gameInfo.gamePhoto,
        gameScore: parseInt(gameInfo.score),
        gamePlatform: gameInfo.platform,
        gameDate: gameInfo.date,
        gameReview: gameInfo.review,
        gameStatus: gameInfo.gameStatus,
        gameTotalTime: gameInfo.gameTotalTime,
        screenshots: [],
        createdAt: serverTimestamp(),
        userId: authFBConfig.lastNotifiedUid,
      });
    } else {
      if (querySearch === "create") {
        await addDoc(gamesRef, {
          gameName: gameInfo.name,
          gamePhoto: gameInfo.gamePhoto,
          gameScore: parseInt(gameInfo.score),
          gamePlatform: gameInfo.platform,
          gameDate: gameInfo.date,
          gameReview: gameInfo.review,
          gameStatus: gameInfo.gameStatus,
          gameTotalTime: gameInfo.gameTotalTime,
          screenshots: [],
          createdAt: serverTimestamp(),
          userId: authFBConfig.lastNotifiedUid,
        });
      } else if (querySearch === "edit") {
        await updateDoc(gameDocRef, {
          gameName: gameInfo.name,
          gamePhoto: gameInfo.gamePhoto,
          gameScore: parseInt(gameInfo.score),
          gamePlatform: gameInfo.platform,
          gameDate: gameInfo.date,
          gameReview: gameInfo.review,
          gameStatus: gameInfo.gameStatus,
          gameTotalTime: gameInfo.gameTotalTime,
        });
        closeModal();
      } else {
        console.error("Hatalı search query");
      }
    }
    setGameInfo({
      name: "",
      gamePhoto: "",
      score: "",
      platform: "",
      date: "",
      review: "",
    });
  };
  const deleteFromFirestore = async () => {
    const gamesRef = collection(db, "games");
    const gameDocRef = doc(gamesRef, docId);
    await deleteDoc(gameDocRef);
    dispatch(modalFunc());
  };
  return (
    <>
      {toggleWarningModal ? (
        <WarningModal
          deleteFromFirestore={deleteFromFirestore}
          setToggleWarningModal={setToggleWarningModal}
        ></WarningModal>
      ) : (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center">
          <div className="w-1/3 bg-white shadow-lg rounded-md p-4">
            <div className="border-b py-3 flex items-center justify-between">
              <div className="text-2xl">Yeni Bir Oyun Ekle</div>
              <div className="flex space-x-5 items-center">
                <FaRegTrashAlt
                  className="cursor-pointer"
                  size={20}
                  onClick={() => setToggleWarningModal(true)}
                ></FaRegTrashAlt>
                <IoIosClose
                  className="cursor-pointer bg-red-600 rounded-full text-white hover:bg-red-700"
                  size={24}
                  onClick={closeModal}
                ></IoIosClose>
              </div>
            </div>
            <input
              className="h-10 w-full border rounded-md p-2 outline-none mt-3"
              value={gameInfo.name}
              type="text"
              placeholder="Oyun İsmi (Zorunlu)"
              name="name"
              id="name"
              onChange={(e) => onchangeFunc(e)}
            />
            <input
              className="h-10 w-full border rounded-md p-2 outline-none mt-3"
              value={gameInfo.gamePhoto}
              type="text"
              placeholder="Oyun Fotoğraf Url (İsteğe Bağlı)"
              name="gamePhoto"
              id="gamePhoto"
              onChange={(e) => onchangeFunc(e)}
            />
            <div className="flex items-center mt-3">
              <label htmlFor="platform" className="mr-2">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                className="h-10 w-full border rounded-md p-2 outline-none"
                onChange={(e) => onchangeFunc(e)}
                value={gameInfo.platform}
              >
                <option value="Steam">Steam</option>
                <option value="Epic Games">Epic Games</option>
                <option value="Ubisoft">Ubisoft</option>
                <option value="Xbox(Pc)">Xbox(PC)</option>
                <option value="EA Games">EA Games</option>
                <option value="Ubisoft">Ubisoft</option>
                <option value="Torrent">Torrent</option>
                <option value="Playstation">Playstation</option>
                <option value="Xbox Series">Xbox Series</option>
                <option value="Nintendo">Nintendo</option>
                <option value="Mobile">Mobile</option>
                <option value="Diğer Platformlar">Diğer Platformlar</option>
              </select>
            </div>
            <div className="flex items-center mt-3">
              <label htmlFor="score" className="mr-2">
                Puan
              </label>
              <select
                id="score"
                name="score"
                className="h-10 w-full border rounded-md p-2 outline-none"
                onChange={(e) => onchangeFunc(e)}
                value={gameInfo.score}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex items-center mt-3">
              <label htmlFor="gameStatus" className="mr-2">
                Oyun Durumu
              </label>
              <select
                id="gameStatus"
                name="gameStatus"
                className="h-10 w-full border rounded-md p-2 outline-none"
                onChange={(e) => onchangeFunc(e)}
                value={gameInfo.gameStatus}
              >
                <option value="Bitirildi">Bitirildi</option>
                <option value="Bırakıldı">Bırakıldı</option>
                <option value="Bitirilecek">Bitirilecek</option>
                <option value="Aktif Oynanılıyor">Aktif Oynanılıyor</option>
              </select>
            </div>
            <input
              className="h-10 w-full border rounded-md p-2 outline-none mt-3"
              value={gameInfo.gameTotalTime}
              type="number"
              placeholder="Toplam Saat (İsteğe Bağlı)"
              name="gameTotalTime"
              id="gameTotalTime"
              onChange={(e) => onchangeFunc(e)}
            />
            <div className="flex items-center mt-3">
              <label htmlFor="date" className="mr-2">
                Başlangıç Tarihi
              </label>

              <input
                type="date"
                name="date"
                id="date"
                className="h-10 w-full border rounded-md p-2 outline-none"
                onChange={(e) => onchangeFunc(e)}
              />
            </div>
            <textarea
              className="w-full border rounded-md p-1 outline-none mt-3"
              type="text"
              placeholder="İnceleme (İsteğe Bağlı)"
              name="review"
              value={gameInfo.review}
              id="review"
              onChange={(e) => onchangeFunc(e)}
              rows={4}
            />
            <button
              className={
                gameInfo.name && gameInfo.score && gameInfo.platform
                  ? "w-full h-10 bg-indigo-600 text-white flex items-center justify-center mt-2 rounded-md border-none"
                  : "w-full h-10  cursor-not-allowed flex items-center justify-center mt-2 rounded-md border disabled"
              }
              onClick={gameInfo.name && gameInfo.score && gameInfo.platform ? uploadToFirestore : undefined}
            >
              Kaydet
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
