import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import PageContainer from "./components/container/PageContainer";
import Navbar from "./components/navbar/Navbar";
import GameDetail from "./components/pages/GameDetail";
import Auth from "./components/pages/Auth";
import User from "./components/pages/User";

function App() {
  return (
    <>
      <Router>
        <Navbar></Navbar>
        <PageContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/user/:id/game/:slug" element={<GameDetail />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </PageContainer>
      </Router>
    </>
  );
}

export default App;
