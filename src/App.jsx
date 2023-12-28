import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Navbar from "./components/navbar/Navbar";
import GameDetail from "./components/pages/GameDetail";
import Auth from "./components/pages/Auth";
import UserProfile from "./components/pages/UserProfile";
import Users from "./components/pages/Users";

function App() {
  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/user/:id/game/:id" element={<GameDetail />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
