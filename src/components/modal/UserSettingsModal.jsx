import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { collection, doc, updateDoc } from "firebase/firestore";
import { authFBConfig, db } from "../../config/firebaseConfig";
import { toggleUserSettingsModal } from "../../redux/modalSlice";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";

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
    navigate(location.pathname);
    setUserInfo({
      name: "",
      photoUrl: "",
    });
  };

  const onchangeFunc = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart(),
    }));
  };
  const uploadToFirestore = async (e) => {
    e.preventDefault();
    const userRef = collection(db, "users");
    const userDocRef = doc(userRef, docId);
    await updateDoc(userDocRef, {
      name: userInfo.name.trim(),
      photoUrl: userInfo.photoUrl.trim(),
    });
    closeModal();
    window.location.reload();
    setUserInfo({
      name: "",
      photoUrl: "",
    });
  };
  const verifyEmail = async () => {
    await sendEmailVerification(authFBConfig.currentUser);
  };
  const resetPassword = async () => {
    authFBConfig.currentUser.emailVerified
      ? await sendPasswordResetEmail(authFBConfig, authFBConfig.currentUser.email)
      : console.error("Email doğrulanmadı");
  };

  return (
    <>
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Kullanıcı Bilgileri Düzenle</h3>
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
            {/* Modal body */}

            <form className="p-4 md:p-5" onSubmit={(e) => uploadToFirestore(e)}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Kullanıcı Adı *
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    placeholder="Kullanıcı Adı (Zorunlu)"
                    name="name"
                    id="name"
                    onChange={(e) => onchangeFunc(e)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Profil Fotoğrafı Url
                  </label>
                  <textarea
                    name="photoUrl"
                    id="photoUrl"
                    value={userInfo.photoUrl}
                    onChange={(e) => onchangeFunc(e)}
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Profil Fotoğraf Url"
                  ></textarea>
                </div>
              </div>
              <div className="col-span-2 flex justify-center space-x-2">
                {!authFBConfig.currentUser.emailVerified && (
                  <button
                    className="text-white inline-flex items-center bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800 duration-300"
                    onClick={verifyEmail}
                  >
                    E-posta Doğrula
                  </button>
                )}
                <button
                  className={`text-white inline-flex items-center  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  duration-300 ${
                    authFBConfig.currentUser.emailVerified
                      ? "bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800 cursor-pointer"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  onClick={resetPassword}
                >
                  Şifre Sıfırla
                </button>
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
    </>
  );
};

export default UserSettingsModal;
