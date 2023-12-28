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
      score: PropTypes.number,
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

  const uploadToFirestore = async (e) => {
    e.preventDefault();
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
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sign in to our platform</h3>
                <div className="flex items-center space-x-1">
                  <FaRegTrashAlt
                    className="cursor-pointer end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
                    size={20}
                    onClick={() => setToggleWarningModal(true)}
                  ></FaRegTrashAlt>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="authentication-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>
              {/* Modal body */}

              <form className="p-4 md:p-5" onSubmit={(e) => uploadToFirestore(e)}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={gameInfo.name}
                      placeholder="Oyun İsmi (Zorunlu)"
                      onChange={(e) => onchangeFunc(e)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Oyun Fotoğraf Url
                    </label>
                    <input
                      type="text"
                      name="gamePhoto"
                      id="gamePhoto"
                      value={gameInfo.gamePhoto}
                      placeholder="Oyun Fotoğraf Url (İsteğe Bağlı)"
                      onChange={(e) => onchangeFunc(e)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Toplam Oynama Saati
                    </label>
                    <input
                      type="number"
                      name="gameTotalTime"
                      id="gameTotalTime"
                      onChange={(e) => onchangeFunc(e)}
                      value={gameInfo.gameTotalTime}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="158"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Platform
                    </label>
                    <select
                      id="platform"
                      name="platform"
                      onChange={(e) => onchangeFunc(e)}
                      value={gameInfo.platform}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Puan
                    </label>
                    <select
                      id="score"
                      name="score"
                      onChange={(e) => onchangeFunc(e)}
                      value={gameInfo.score}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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

                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Oyun Durumu
                    </label>
                    <select
                      id="gameStatus"
                      name="gameStatus"
                      onChange={(e) => onchangeFunc(e)}
                      value={gameInfo.gameStatus}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="Bitirildi">Bitirildi</option>
                      <option value="Bırakıldı">Bırakıldı</option>
                      <option value="Bitirilecek">Bitirilecek</option>
                      <option value="Aktif Oynanılıyor">Aktif Oynanılıyor</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Oyun Fotoğraf Url
                    </label>
                    <input
                      type="text"
                      name="gamePhoto"
                      id="gamePhoto"
                      value={gameInfo.gamePhoto}
                      placeholder="Oyun Fotoğraf Url (İsteğe Bağlı)"
                      onChange={(e) => onchangeFunc(e)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Oyun İncelemesi
                    </label>
                    <textarea
                      name="review"
                      value={gameInfo.review}
                      id="review"
                      onChange={(e) => onchangeFunc(e)}
                      rows={4}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Oyun İncelemenizi Buraya Yazınız (İsteğe Bağlı)"
                    ></textarea>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
