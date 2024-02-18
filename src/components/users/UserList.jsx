import { BiTrash } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersFromDB } from "../../redux/authSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserSettingsModal from "../modal/UserSettingsModal";
import { toggleUserSettingsModal } from "../../redux/modalSlice";
import logo from "../../assets/logo.png";
import WarningDeleteUser from "./WarningDeleteUser";
import UserTableRowSkeleton from "../skeleton/UserTableRowSkeleton";
import { fetchIGDBGameData } from "../../config/rawgConfig";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.auth.users);
  const token = useSelector((state) => state.auth.token);
  const userSettingsModal = useSelector((state) => state.modal.userSettingsModal);
  const [userInfo, setUserInfo] = useState({ name: "", photoUrl: "" });
  const [userGames, setUserGames] = useState([]);
  const [userSS, setUserSS] = useState([]);
  const [loggedUser, setLoggedUser] = useState(() => {
    return token ? users.find((user) => user.id === JSON.parse(token).uid) : null;
  });

  const [adminMode, setAdminMode] = useState(false);
  const [toggleWarningModal, setToggleWarningModal] = useState(false);
  const fetchUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);
    const fetchedUsers = [];
    querySnapshot.forEach((doc) => {
      fetchedUsers.push({ id: doc.id, data: doc.data() });
    });
    dispatch(fetchUsersFromDB(fetchedUsers));
  };
  const adminUsers = users.filter((user) => user.data.role === "admin");
  const regularUsers = users.filter((user) => user.data.role !== "admin");
  const sortedUsers = [...adminUsers, ...regularUsers.sort((a, b) => a.data.name.localeCompare(b.data.name))];
  fetchIGDBGameData();
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchGameSize = async (userId) => {
      const gamesRef = collection(db, "games");
      const querryMessages = query(gamesRef, where("userId", "==", userId), orderBy("gameName"));
      const snapshot = await getDocs(querryMessages);
      const gameSizes = snapshot.docs.map((doc) => doc.data().size);
      const finishedGameSizes = snapshot.docs
        .map((doc) => doc.data())
        .filter((game) => game.gameStatus === "Bitirildi");
      const screenShotSizes = snapshot.docs.map((doc) => doc.data()).map((game) => game.screenshots.length);
      return { userId, gameSizes, finishedGameSizes, screenShotSizes };
    };

    const updateUserGameSizes = async () => {
      const updatedUserGameSizes = await Promise.all(
        sortedUsers.map(async (user) => {
          const gameSize = await fetchGameSize(user.id);
          return gameSize;
        })
      );
      setUserGames(updatedUserGameSizes);
    };
    const updateUserGameSSSizes = async () => {
      const updatedUserGameSSSizes = await Promise.all(
        sortedUsers.map(async (user) => {
          const gameSize = await fetchGameSize(user.id);
          return gameSize;
        })
      );

      const test = updatedUserGameSSSizes.map((x) => {
        const toplam = x.screenShotSizes.reduce(function (acc, current) {
          return acc + current;
        }, 0);
        return toplam;
      });
      setUserSS(test);
    };
    updateUserGameSizes();
    updateUserGameSSSizes();
    token && setLoggedUser(users.find((user) => user.id === JSON.parse(token).uid));
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
  const warningDeleteUserFunc = (e) => {
    setToggleWarningModal(true);
    navigate(`?userDelete=${e}`);
  };
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {userSettingsModal && <UserSettingsModal setUserInfo={setUserInfo} userInfo={userInfo}></UserSettingsModal>}
      {toggleWarningModal && (
        <WarningDeleteUser setToggleWarningModal={setToggleWarningModal} loggedUser={loggedUser}></WarningDeleteUser>
      )}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          <div className="flex justify-between">
            <span>Tüm Üyeler</span>
            {token && (
              <div className="space-x-5 flex items-center">
                {token && loggedUser?.data.role === "admin" && (
                  <RiAdminFill
                    className={`hover:text-sky-800 duration-300 cursor-pointer ${
                      !adminMode ? "text-green-700" : "text-red-500"
                    }`}
                    size={20}
                    onClick={() => setAdminMode(!adminMode)}
                  />
                )}
                {users.length !== 0 && (
                  <span
                    className="hover:text-sky-800 duration-300 cursor-pointer text-sm lg:text-lg"
                    onClick={openUserSettingsModal}
                  >
                    Profili Düzenle
                  </span>
                )}
              </div>
            )}
          </div>
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">
              Üye
            </th>
            <th scope="col" className="px-6 py-3">
              Oyunlar
            </th>
            <th scope="col" className="px-6 py-3">
              Bitirilen Oyunlar
            </th>
            <th scope="col" className="px-6 py-3">
              Toplam SS
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <UserTableRowSkeleton rowCount={7} />
          ) : (
            sortedUsers.map((user, index) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                <td className="px-0 py-0 lg:px-4 lg:py-4">
                  <Link to={`/user/${user.id}`} className="hover:text-sky-800 duration-150 cursor-pointer">
                    {user.data.photoUrl === "" ? (
                      <img
                        src={logo}
                        alt="Kullanıcı Fotoğrafı"
                        className="object-cover w-16 h-16 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out"
                      />
                    ) : (
                      <img
                        src={user.data.photoUrl}
                        alt="Geçersiz Fotoğraf Url"
                        className="object-cover w-16 h-16 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out"
                      />
                    )}
                  </Link>
                </td>

                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-3">
                    <Link to={`/user/${user.id}`} className="hover:text-sky-800 duration-150 cursor-pointer">
                      {user.data.name}
                      {user.data.role === "admin" && (
                        <span className="text-red-500 hover:text-rose-800 duration-150"> (Admin)</span>
                      )}
                    </Link>
                    {user.data.role === "user" && adminMode && (
                      <BiTrash
                        className="text-red-500 hover:text-red-800 cursor-pointer"
                        size={18}
                        onClick={() => warningDeleteUserFunc(user.id)}
                      />
                    )}
                  </div>
                </th>
                <td className="px-6 py-4">{userGames.find((game) => game.userId === user.id)?.gameSizes.length}</td>
                <td className="px-6 py-4">
                  {userGames.filter((game) => game.userId === user.id)[0]?.finishedGameSizes.length}
                </td>
                <td className="px-6 py-4">{userSS[index]} </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
