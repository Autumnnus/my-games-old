import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersFromDB } from "../../redux/authSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserSettingsModal from "../modal/UserSettingsModal";
import { toggleUserSettingsModal } from "../../redux/modalSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.auth.users);
  const token = useSelector((state) => state.auth.token);
  const userSettingsModal = useSelector(
    (state) => state.modal.userSettingsModal
  );
  const [userInfo, setUserInfo] = useState({
    name: "",
    photoUrl: "",
  });
  const [userGames, setUserGames] = useState([]);
  const fetchUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);
    const fetchedUsers = [];
    querySnapshot.forEach((doc) => {
      fetchedUsers.push({ id: doc.id, data: doc.data() });
    });
    dispatch(fetchUsersFromDB(fetchedUsers));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchGameSize = async (userId) => {
      const gamesRef = collection(db, "games");
      const querryMessages = query(
        gamesRef,
        where("userId", "==", userId),
        orderBy("gameName")
      );
      const snapshot = await getDocs(querryMessages);
      const gameSizes = snapshot.docs.map((doc) => doc.data().size);
      return { userId, gameSizes };
    };

    const updateUserGameSizes = async () => {
      const updatedUserGameSizes = await Promise.all(
        users.map(async (user) => {
          const gameSize = await fetchGameSize(user.id);
          return gameSize;
        })
      );
      setUserGames(updatedUserGameSizes);
    };

    updateUserGameSizes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);
  const openUserSettingsModal = () => {
    dispatch(toggleUserSettingsModal());
    navigate(`?userEdit=${JSON.parse(token).uid}`);
    const foundUser = users.find((user) => user.id === JSON.parse(token).uid);
    setUserInfo({
      name: foundUser.data.name,
      photoUrl: foundUser.data.photoUrl,
    });
  };
  return (
    <div>
      {userSettingsModal && (
        <UserSettingsModal
          setUserInfo={setUserInfo}
          userInfo={userInfo}
        ></UserSettingsModal>
      )}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          <div className="flex justify-between">
            <span>Tüm Üyeler</span>
            {token && (
              <p
                className="hover:text-blue-600 cursor-pointer"
                onClick={openUserSettingsModal}
              >
                Profili Düzenle
              </p>
            )}
          </div>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">
              Üye
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Oyunlar
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Bitirilen Oyunlar
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Toplam SS
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <td className="px-4 py-4">
                {user.data.photoUrl === "" ? (
                  <img
                    src={"../../../public/logo.png"}
                    alt="Kullanıcı Fotoğrafı"
                    className="object-cover w-16 h-16 rounded-full"
                  />
                ) : (
                  <img
                    src={user.data.photoUrl}
                    alt="Geçersiz Fotoğraf Url"
                    className="object-cover w-16 h-16 rounded-full"
                  />
                )}
              </td>

              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <Link
                  onClick={() => navigate(`user/${user.id}`)}
                  to={`/user/${user.id}`}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {user.data.name}
                </Link>
              </th>
              <td className="px-6 py-4 text-center">
                {/* {userGames.length} */}
                {
                  userGames.find((game) => game.userId === user.id)?.gameSizes
                    .length
                }
              </td>
              <td className="px-6 py-4 text-center">{user.data.name}</td>
              <td className="px-6 py-4 text-center">{user.data.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
