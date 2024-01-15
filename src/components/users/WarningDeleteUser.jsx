import { collection, deleteDoc, doc, getDocs, orderBy, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { query } from "firebase/database";
const WarningDeleteUser = ({ setToggleWarningModal, loggedUser }) => {
  WarningDeleteUser.propTypes = {
    setToggleWarningModal: PropTypes.bool.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.search.split("=")[1];

  const deleteUser = async () => {
    if (loggedUser?.data.role !== "admin") {
      console.error("Yönetici yetkileriniz bulunmamaktadır.");
      return false;
    }
    try {
      const gamesRef = collection(db, "games");
      const querryMessages = query(gamesRef, where("userId", "==", userId), orderBy("gameName"));
      const snapshot = await getDocs(querryMessages);
      let fetchedUserGames = [];
      snapshot.forEach((doc) => {
        fetchedUserGames.push({ id: doc.id, data: doc.data() });
      });
      fetchedUserGames.forEach(async (game) => {
        const gameDocRef = doc(gamesRef, game.id);
        await deleteDoc(gameDocRef);
        console.log(`Belge silindi: ${game.id}, ${game.data.gameName}`);
      });
      setToggleWarningModal(false);
      navigate(location.pathname);
    } catch (error) {
      console.error(error);
    }
  };
  const cancelDeleteUser = () => {
    setToggleWarningModal(false);
    navigate(location.pathname);
  };
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen flex items-center justify-center">
      <div className="relative p-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Kullanıcıyı silmek istediğine emin misin?
            </h3>
          </div>
          {/* Modal body */}

          <div className="p-4 md:p-5">
            <div className="grid gap-2 mb-4 grid-cols-2">
              <button
                type="submit"
                className="text-white inline-flex items-center bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800"
                onClick={deleteUser}
              >
                Evet
              </button>

              <button
                type="submit"
                className="text-white inline-flex items-center bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-700"
                onClick={cancelDeleteUser}
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningDeleteUser;
