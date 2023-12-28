import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleSSModal } from "../../redux/modalSlice";
import { useState } from "react";
import WarningModal from "./WarningModal";

const ScreenShotModal = ({ setSSInfo, ssInfo }) => {
  ScreenShotModal.propTypes = {
    setSSInfo: PropTypes.func.isRequired,
    ssInfo: PropTypes.shape({
      ssUrl: PropTypes.string,
      ssName: PropTypes.string,
    }).isRequired,
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchKey = location.search.split("?")[1].split("=")[0];
  const searchValue = location.search.split("?")[1].split("=")[1];
  const gameId = location.pathname.split("/")[4];
  const [toggleWarningModal, setToggleWarningModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onchangeFunc = (e) => {
    setSSInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const closeModal = () => {
    dispatch(toggleSSModal());
    navigate(location.pathname);
  };
  const generateUniqueID = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date().getTime().toString(36);
    return randomString + timestamp;
  };
  const uploadToFirestore = async (e) => {
    e.preventDefault();
    const gamesRef = collection(db, "games");
    const gameDocRef = doc(gamesRef, gameId);
    const gameDoc = await getDoc(gameDocRef);

    if (searchKey === "create") {
      const updatedScreenshots = [
        ...gameDoc.data().screenshots,
        {
          ssUrl: ssInfo.ssUrl,
          ssName: ssInfo.ssName,
          id: generateUniqueID(),
        },
      ];
      await updateDoc(gameDocRef, { screenshots: updatedScreenshots });
      setSuccessMessage("Ekran görüntüsü başarıyla eklendi");
      setTimeout(() => setSuccessMessage(""), 2000);
    } else if (searchKey === "editSS") {
      const updatedScreenshots = gameDoc.data().screenshots.map((ss) =>
        ss.id === searchValue
          ? {
              ...ss,
              ssUrl: ssInfo.ssUrl,
              ssName: ssInfo.ssName,
            }
          : ss
      );
      await updateDoc(gameDocRef, { screenshots: updatedScreenshots });
      closeModal();
    } else {
      console.error("Hatalı search query");
    }
    setSSInfo({
      ssUrl: "",
      ssName: "",
    });
  };
  const deleteSSFromFirestore = async () => {
    const gamesRef = collection(db, "games");
    const gameDocRef = doc(gamesRef, gameId);
    const gameDoc = await getDoc(gameDocRef);
    if (!gameDoc.exists() || !gameDoc.data().screenshots) {
      console.error("Belge veya ekran görüntüsü bulunamadı.");
      return;
    }
    const updatedScreenshots = gameDoc.data().screenshots.filter((ss) => ss.id !== searchValue);
    if (updatedScreenshots.length === gameDoc.data().screenshots.length) {
      console.error("Silinecek ekran görüntüsü bulunamadı.");
      return;
    }
    await updateDoc(gameDocRef, { screenshots: updatedScreenshots });
  };

  const deleteWarningModal = () => {
    setToggleWarningModal(true);
  };
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center">
      {toggleWarningModal ? (
        <WarningModal
          deleteSSFromFirestore={deleteSSFromFirestore}
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {searchKey === "create" ? (
                    <h1>Yeni Bir Ekran Görüntüsü Ekle</h1>
                  ) : searchKey === "editSS" ? (
                    <h1>Ekran Görüntüsünü Düzenle</h1>
                  ) : null}
                </h3>
                <div className="flex items-center space-x-1">
                  {searchKey === "editSS" && (
                    <FaRegTrashAlt
                      className="cursor-pointer end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
                      size={20}
                      onClick={deleteWarningModal}
                    ></FaRegTrashAlt>
                  )}
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
                      Oyun Fotoğraf Url
                    </label>
                    <input
                      type="text"
                      value={ssInfo.ssUrl}
                      placeholder="Oyun Fotoğraf Url (Zorunlu)"
                      name="ssUrl"
                      id="ssUrl"
                      onChange={(e) => onchangeFunc(e)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required=""
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Fotoğraf Açıklaması
                    </label>
                    <textarea
                      name="ssName"
                      id="ssName"
                      value={ssInfo.ssName}
                      onChange={(e) => onchangeFunc(e)}
                      rows={4}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Fotoğraf Açıklaması (İsteğe Bağlı)"
                    ></textarea>
                  </div>
                </div>
                <div>{successMessage && <div className="text-green-600">{successMessage}</div>}</div>
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
    </div>
  );
};

export default ScreenShotModal;
