import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toggleUserSettingsModal } from "../../redux/modalSlice";

const UserSettingsModal = ({ setUserInfo, userInfo }) => {
  UserSettingsModal.propTypes = {
    setUserInfo: PropTypes.func.isRequired,
    userInfo: PropTypes.shape({
      name: PropTypes.string,
      photoUrl: PropTypes.string,
    }).isRequired,
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const docId = location.search.split("=")[1];
  const closeModal = () => {
    dispatch(toggleUserSettingsModal());
    navigate("/");
  };

  const onchangeFunc = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const uploadToFirestore = async () => {
    const userRef = collection(db, "users");
    const userDocRef = doc(userRef, docId);
    await updateDoc(userDocRef, {
      name: userInfo.name,
      photoUrl: userInfo.photoUrl,
    });
    closeModal();
    window.location.reload();
    setUserInfo({
      name: "",
      photoUrl: "",
    });
  };
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center">
        <div className="w-1/3 bg-white shadow-lg rounded-md p-4">
          <div className="border-b py-3 flex items-center justify-between">
            <div className="text-2xl">Kullanıcı Bilgileri Düzenle</div>
            <div className="flex space-x-5 items-center">
              <IoIosClose
                className="cursor-pointer bg-red-600 rounded-full text-white hover:bg-red-700"
                size={24}
                onClick={closeModal}
              ></IoIosClose>
            </div>
          </div>
          <input
            className="h-10 w-full border rounded-md p-2 outline-none mt-3"
            value={userInfo.name}
            type="text"
            placeholder="Kullanıcı Adı"
            name="name"
            id="name"
            onChange={(e) => onchangeFunc(e)}
          />
          <textarea
            className="w-full border rounded-md p-2 outline-none mt-3"
            rows={6}
            value={userInfo.photoUrl}
            type="text"
            placeholder="Profil Fotoğraf Url"
            name="photoUrl"
            id="photoUrl"
            onChange={(e) => onchangeFunc(e)}
          />
          <button
            className="w-full h-10 bg-indigo-600 text-white flex items-center justify-center mt-2 rounded-md border-none"
            onClick={uploadToFirestore}
          >
            Kaydet
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSettingsModal;
