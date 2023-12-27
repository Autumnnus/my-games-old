import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
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
  const uploadToFirestore = async () => {
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
      console.log("ScreenShot Eklendi");
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
      console.log("ScreenShot Düzenlendi");
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
      console.log("Belge veya ekran görüntüsü bulunamadı.");
      return;
    }
    const updatedScreenshots = gameDoc.data().screenshots.filter((ss) => ss.id !== searchValue);
    if (updatedScreenshots.length === gameDoc.data().screenshots.length) {
      console.log("Silinecek ekran görüntüsü bulunamadı.");
      return;
    }
    await updateDoc(gameDocRef, { screenshots: updatedScreenshots });
    console.log("Ekran görüntüsü başarıyla silindi");
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
        <div className="w-1/3 bg-white shadow-lg rounded-md p-4">
          <div className="border-b py-3 flex items-center justify-between">
            <div className="text-2xl">
              {searchKey === "create" ? (
                <h1>Yeni Bir Ekran Görüntüsü Ekle</h1>
              ) : searchKey === "editSS" ? (
                <h1>Ekran Görüntüsünü Düzenle</h1>
              ) : null}
            </div>
            <div className="flex space-x-5 items-center">
              {searchKey === "editSS" && (
                <FaRegTrashAlt className="cursor-pointer" size={20} onClick={deleteWarningModal}></FaRegTrashAlt>
              )}
              <IoIosClose
                className="cursor-pointer bg-red-600 rounded-full text-white hover:bg-red-700"
                size={24}
                onClick={closeModal}
              ></IoIosClose>
            </div>
          </div>
          <input
            className="h-10 w-full border rounded-md p-2 outline-none mt-3"
            value={ssInfo.ssUrl}
            type="text"
            placeholder="Oyun Fotoğraf Url (Zorunlu)"
            name="ssUrl"
            id="ssUrl"
            onChange={(e) => onchangeFunc(e)}
          />
          <input
            className="h-10 w-full border rounded-md p-2 outline-none mt-3"
            value={ssInfo.ssName}
            type="text"
            placeholder="Oyun İsmi (İsteğe Bağlı)"
            name="ssName"
            id="ssName"
            onChange={(e) => onchangeFunc(e)}
          />

          <button
            className="w-full h-10 bg-indigo-600 text-white flex items-center justify-center mt-2 rounded-md border-none"
            onClick={uploadToFirestore}
          >
            Kaydet
          </button>
        </div>
      )}
    </div>
  );
};

export default ScreenShotModal;
