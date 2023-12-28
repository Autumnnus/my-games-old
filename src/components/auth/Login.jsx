import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFBConfig } from "../../config/firebaseConfig";
import { useDispatch } from "react-redux";
import { authInfo, loginFunc, toggleLoginMode } from "../../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const onchangeFunc = (e) => {
    setLoginInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const auth = authFBConfig;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password);
      const user = userCredential.user;
      auth.onAuthStateChanged((user) => {
        if (user) {
          dispatch(loginFunc(JSON.stringify(user)));
        } else {
          localStorage.removeItem("my-game-user");
        }
      });
      const userPayload = {
        uid: user.uid,
        email: user.email,
      };
      dispatch(authInfo(userPayload));
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-[38rem]">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Giriş Yap</h3>
              <button
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
            {/* Modal body */}
            <div className="p-4 md:p-5">
              <form className="space-y-4" action="#" onSubmit={(e) => handleLogin(e)}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    E-mail Adresi:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => onchangeFunc(e)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Şifre:
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => onchangeFunc(e)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Giriş Yap
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Hesabın yok mu?
                  <span
                    className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer ml-2"
                    onClick={() => dispatch(toggleLoginMode())}
                  >
                    Kayıt Ol
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
