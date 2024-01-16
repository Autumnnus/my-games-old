import { useDispatch, useSelector } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import { modalFunc } from "../../redux/modalSlice";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { authFBConfig, db } from "../../config/firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import WarningModal from "./WarningModal";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
const Modal = ({ setGameInfo, gameInfo, searchParam }) => {
  Modal.propTypes = {
    setGameInfo: PropTypes.func.isRequired,
    searchParam: PropTypes.string.isRequired,
    gameInfo: PropTypes.shape({
      name: PropTypes.string,
      gamePhoto: PropTypes.string,
      score: PropTypes.number,
      platform: PropTypes.string,
      date: PropTypes.string,
      review: PropTypes.string,
      gameStatus: PropTypes.string,
      gameTotalTime: PropTypes.number,
    }).isRequired,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const docId = queryParams.get("edit");
  const createParam = queryParams.get("create");
  const editParam = queryParams.get("edit");
  const userId = location.pathname.split("/")[2];
  const token = useSelector((state) => state.auth.token);
  const [message, setMessage] = useState("");
  const [toggleWarningModal, setToggleWarningModal] = useState(false);

  const closeModal = () => {
    dispatch(modalFunc());
    searchParam ? navigate(`${location.pathname}?search=${searchParam}`) : navigate(location.pathname);
    setGameInfo({
      name: "",
      gamePhoto: "",
      score: 0,
      platform: "Steam",
      date: "",
      review: "",
      gameStatus: "Bitirildi",
      gameTotalTime: null,
    });
  };
  const onchangeFunc = (e) => {
    setGameInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart(),
    }));
  };
  const uploadToFirestore = async (e) => {
    e.preventDefault();
    if (JSON.parse(token).uid !== userId) {
      setMessage("Uyuşmayan Kullanıcı Bilgileri");
      setTimeout(() => setMessage(""), 2000);
      return console.error("Uyuşmayan Kullanıcı Bilgileri");
    }
    const gamesRef = collection(db, "games");
    const gamesQuery = query(gamesRef);
    const gamesSnapshot = await getDocs(gamesQuery);
    if (gamesSnapshot.empty) {
      await addDoc(gamesRef, {
        gameName: gameInfo.name.trim(),
        gamePhoto: gameInfo.gamePhoto.trim(),
        gameScore: gameInfo.score && gameInfo.score < 10 ? parseFloat(parseFloat(gameInfo.score).toFixed(1)) : 10,
        gamePlatform: gameInfo.platform,
        gameDate: gameInfo.date,
        gameReview: gameInfo.review.trim(),
        gameStatus: gameInfo.gameStatus,
        gameTotalTime: parseFloat(gameInfo.gameTotalTime),
        screenshots: [],
        createdAt: serverTimestamp(),
        userId: authFBConfig.lastNotifiedUid,
      });
    } else {
      if (createParam) {
        await addDoc(gamesRef, {
          gameName: gameInfo.name.trim(),
          gamePhoto: gameInfo.gamePhoto.trim(),
          gameScore: gameInfo.score && gameInfo.score < 10 ? parseFloat(parseFloat(gameInfo.score).toFixed(1)) : 10,
          gamePlatform: gameInfo.platform,
          gameDate: gameInfo.date,
          gameReview: gameInfo.review.trim(),
          gameStatus: gameInfo.gameStatus,
          gameTotalTime: parseFloat(gameInfo.gameTotalTime),
          screenshots: [],
          createdAt: serverTimestamp(),
          userId: authFBConfig.lastNotifiedUid,
        });
      } else if (!createParam && editParam) {
        const gameDocRef = doc(gamesRef, docId);
        await updateDoc(gameDocRef, {
          gameName: gameInfo.name.trim(),
          gamePhoto: gameInfo.gamePhoto.trim(),
          gameScore: gameInfo.score && gameInfo.score < 10 ? parseFloat(parseFloat(gameInfo.score).toFixed(1)) : 10,
          gamePlatform: gameInfo.platform,
          gameDate: gameInfo.date,
          gameReview: gameInfo.review.trim(),
          gameStatus: gameInfo.gameStatus,
          gameTotalTime: parseFloat(gameInfo.gameTotalTime),
        });
        closeModal();
      } else {
        console.error("Hatalı search query");
      }
    }
    setGameInfo({
      name: "",
      gamePhoto: "",
      score: 0,
      platform: "Steam",
      date: "",
      review: "",
      gameStatus: "Bitirildi",
      gameTotalTime: null,
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
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-start w-full h-screen bg-black bg-opacity-50 overflow-auto"
        >
          <div className="relative p-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {createParam ? <span>Yeni Bir Oyun Ekle</span> : editParam ? <span>Oyunu Düzenle</span> : null}
                </h1>
                <div className="flex items-center space-x-1">
                  <FaRegTrashAlt
                    className="cursor-pointer end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm ms-auto dark:hover:bg-gray-600 dark:hover:text-white duration-300"
                    size={20}
                    onClick={() => setToggleWarningModal(true)}
                  ></FaRegTrashAlt>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white duration-300"
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
                      Oyun İsmi *
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
                      Puan{" "}
                      <a data-tooltip-id="my-tooltip" className="text-orange-300">
                        (?)
                      </a>
                      <Tooltip id="my-tooltip">
                        <div className="space-y-3">
                          <h3 className="text-center text-sky-400">Puanlama Sistemi</h3>
                          <p>Oynadığınız oyunu puanlamada sıkıntı çekiyorsan buna göre puanlayınız:</p>
                          <ul>
                            <li className="text-rose-700">0 (Rezalet Ötesi, Oyun bile değil)</li>
                            <li className="text-rose-500">1 (Berbat)</li>
                            <li className="text-rose-300">2 (Çok Kötü)</li>
                            <li className="text-yellow-500">3 (Kötü)</li>
                            <li className="text-yellow-300">4 (İdare Eder)</li>
                            <li className="text-green-100">5 (Ortalama)</li>
                            <li className="text-green-300">6 (Ortalama Üstü)</li>
                            <li className="text-green-500">7 (İyi)</li>
                            <li className="text-green-700">8 (Çok İyi)</li>
                            <li className="text-sky-300">9 (Muhteşem Ötesi)</li>
                            <li className="text-blue-500">10 (Böyle bir oyun 100 yılda bir gelir)</li>
                            <br />
                            <li className="text-gray-50">
                              <span className="text-red-500">Not: </span>En fazla 10 puan ve en az 0 puan
                              verebilirsiniz. Ondalıklı sayı vererbilirsiniz fakat maximum 1 hanesi olacaktır.
                            </li>
                          </ul>
                        </div>
                      </Tooltip>
                    </label>
                    <input
                      type="number"
                      name="score"
                      id="score"
                      onChange={(e) => onchangeFunc(e)}
                      value={gameInfo.score}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="7.5"
                    />
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
                      Son Oynama Tarihi
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={gameInfo.date}
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
                <div>{message && <div className="text-rose-600">{message}</div>}</div>
                <div className="col-span-2 flex justify-center">
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 duration-300"
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
