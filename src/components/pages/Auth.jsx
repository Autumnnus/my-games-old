import { useSelector } from "react-redux";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import PageContainer from "../container/PageContainer";

const Auth = () => {
  const loginMode = useSelector((state) => state.auth.loginMode);
  return (
    <div>
      <PageContainer>{loginMode ? <Login></Login> : <Signup></Signup>}</PageContainer>
    </div>
  );
};

export default Auth;
