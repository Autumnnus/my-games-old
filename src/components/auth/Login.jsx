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
  const handleLogin = async () => {
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
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Giriş Yap</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="E-mail adresinizi giriniz"
            onChange={(e) => onchangeFunc(e)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">
            Şifre:
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Şifrenizi Giriniz"
            onChange={(e) => onchangeFunc(e)}
          />
        </div>
        <div>
          <button
            className="w-full bg-rose-800 text-white py-2 rounded-lg hover:bg-rose-950 transition duration-300 mb-4"
            onClick={handleLogin}
          >
            Giriş Yap
          </button>
          <button
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-300 transition duration-300"
            onClick={() => dispatch(toggleLoginMode())}
          >
            Hesabım Yok
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
