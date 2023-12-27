import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleLoginMode } from "../../redux/authSlice";
import validator from "validator";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { authFBConfig, db } from "../../config/firebaseConfig";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

const Signup = () => {
  const dispatch = useDispatch();
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    email: "",
    password: "",
    photoUrl: "",
  });

  const onchangeFunc = (e) => {
    setLoginInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const auth = authFBConfig;
  const handleSignup = async () => {
    try {
      const isEmailValid = validator.isEmail(loginInfo.email);
      if (!isEmailValid) {
        console.error("Invalid E-mail");
      } else if (loginInfo.password.length < 6) {
        console.error("Password must be at least 6 characters");
      } else if (!loginInfo.username) {
        console.error("Name is required");
      } else {
        //* AUTH
        const userCredential = await createUserWithEmailAndPassword(auth, loginInfo.email, loginInfo.password);
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: loginInfo.username,
          photoURL: loginInfo.photoUrl,
        });

        //* DATABASE
        const userRef = collection(db, "users");
        const customDocRef = doc(userRef, user.uid);
        await setDoc(customDocRef, {
          email: user.email,
          name: user.displayName,
          photoUrl: loginInfo.photoUrl,
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
        console.log("Signed up:", user);
        dispatch(toggleLoginMode());
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Kayıt Ol</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Kullanıcı Adı:
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Kullanıcı adınızı giriniz"
            onChange={(e) => onchangeFunc(e)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Profil Fotoğrafı Url:
          </label>
          <input
            type="text"
            id="photoUrl"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Profil Fotoğrafı Url (İsteğe Bağlı)"
            onChange={(e) => onchangeFunc(e)}
          />
        </div>
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
            onClick={handleSignup}
          >
            Kayıt Ol
          </button>
          <button
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-300 transition duration-300"
            onClick={() => dispatch(toggleLoginMode())}
          >
            Zaten Hesabım Var
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
