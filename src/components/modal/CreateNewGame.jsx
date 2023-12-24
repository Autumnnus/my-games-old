import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { modalFunc } from "../../redux/modalSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authFBConfig, db } from "../../config/firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
const CreateNewGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const closeModal = () => {
    dispatch(modalFunc());
    navigate("/");
  };
  const [gameInfo, setGameInfo] = useState({
    name: "",
    gamePhoto: "",
    score: "",
    platform: "",
    date: "",
    review: "",
  });

  const onchangeFunc = (e) => {
    setGameInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadToFirestore = async () => {
    const gamesRef = collection(db, "games");
    const gamesQuery = query(gamesRef);
    const gamesSnapshot = await getDocs(gamesQuery);

    if (gamesSnapshot.empty) {
      await addDoc(gamesRef, {
        gameName: gameInfo.name,
        gamePhoto: gameInfo.gamePhoto,
        gameScore: gameInfo.score,
        gamePlatform: gameInfo.platform,
        gameDate: gameInfo.date,
        gameReview: gameInfo.review,
        createdAt: serverTimestamp(),
        user: authFBConfig.currentUser?.displayName,
        userId: authFBConfig.lastNotifiedUid,
      });
    } else {
      await addDoc(gamesRef, {
        gameName: gameInfo.name,
        gamePhoto: gameInfo.gamePhoto,
        gameScore: gameInfo.score,
        gamePlatform: gameInfo.platform,
        gameDate: gameInfo.date,
        gameReview: gameInfo.review,
        createdAt: serverTimestamp(),
        user: authFBConfig.currentUser?.displayName,
        userId: authFBConfig.lastNotifiedUid,
      });
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

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center">
        <div className="w-1/3 bg-white shadow-lg rounded-md p-4">
          <div className="border-b py-3 flex items-center justify-between">
            <div className="text-2xl">Yeni Bir Oyun Ekle</div>
            <IoIosClose
              className="cursor-pointer"
              size={24}
              onClick={closeModal}
            ></IoIosClose>
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
            name="photourl"
            id="photourl"
            onChange={(e) => onchangeFunc(e)}
          />
          <input
            className="h-10 w-full border rounded-md p-2 outline-none mt-3"
            value={gameInfo.score}
            type="text"
            placeholder="Puan (Zorunlu)"
            name="score"
            id="score"
            onChange={(e) => onchangeFunc(e)}
          />
          <input
            className="h-10 w-full border rounded-md p-2 outline-none mt-3"
            value={gameInfo.platform}
            type="text"
            placeholder="Platform (Zorunlu)"
            name="platform"
            id="platform"
            onChange={(e) => onchangeFunc(e)}
          />
          <input
            className="h-10 w-full border rounded-md p-2 outline-none mt-3"
            value={gameInfo.date}
            type="text"
            placeholder="Başlangıç Tarihi (İsteğe Bağlı)"
            name="date"
            id="date"
            onChange={(e) => onchangeFunc(e)}
          />
          <input
            className="h-10 w-full border rounded-md p-1 outline-none mt-3"
            type="text"
            placeholder="İnceleme (İsteğe Bağlı)"
            name="review"
            value={gameInfo.review}
            id="review"
            onChange={(e) => onchangeFunc(e)}
          />
          <button
            className={
              gameInfo.name && gameInfo.score && gameInfo.platform
                ? "w-full h-10 bg-indigo-600 text-white flex items-center justify-center mt-2 rounded-md border-none"
                : "w-full h-10  cursor-not-allowed flex items-center justify-center mt-2 rounded-md border disabled"
            }
            onClick={
              gameInfo.name && gameInfo.score && gameInfo.platform
                ? uploadToFirestore
                : undefined
            }
          >
            Kaydet
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateNewGame;
