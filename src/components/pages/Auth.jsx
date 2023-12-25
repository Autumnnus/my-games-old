import { useSelector } from "react-redux";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

const Auth = () => {
  const loginMode = useSelector((state) => state.auth.loginMode);
  return <div>{loginMode ? <Login></Login> : <Signup></Signup>}</div>;
};

export default Auth;
