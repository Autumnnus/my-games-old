import { useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { modalFunc } from "../../redux/modalSlice";
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { signOut } from "firebase/auth";
import { authFBConfig } from "../../config/firebaseConfig";
import { logoutFunc } from "../../redux/authSlice";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const auth = authFBConfig;

  const handleLogout = () => {
    console.log(auth);
    if (token) {
      signOut(auth)
        .then(() => {
          console.log("Signed out successfully");
        })
        .catch((error) => {
          console.error(error);
        });
      dispatch(logoutFunc());
    } else {
      console.error("User is not authenticated. Cannot sign out.");
    }
  };

  const openModal = () => {
    dispatch(modalFunc());
    navigate("?create=true");
  };

  const handleUser = () => {
    if (!token) {
      navigate("/auth");
    } else {
      navigate(`/user/${JSON.parse(token).uid}`);
    }
  };
  return (
    <nav className="bg-purple-700 p-4 text-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div
            className=" text-xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            My Games
          </div>
          <ul className="flex space-x-5 items-center">
            <li className="text-lg hover:rounded-md">
              {token && (
                <CiCirclePlus
                  className="w-10 h-10 cursor-pointer"
                  onClick={openModal}
                ></CiCirclePlus>
              )}
            </li>
            <li className="text-l hover:rounded-md">
              <FaRegUser
                className="w-8 h-8 cursor-pointer"
                onClick={handleUser}
              ></FaRegUser>
            </li>

            <li className="text-l hover:rounded-md">
              {token && (
                <CiLogout
                  className="w-8 h-8 cursor-pointer"
                  onClick={handleLogout}
                ></CiLogout>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
