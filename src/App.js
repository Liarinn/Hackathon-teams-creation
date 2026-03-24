import "./styles/main.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar"
import Footer from "./components/footer/Footer"
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import NewProject from "./pages/NewProject";
import EditProject from "./pages/EditProject";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ParticipantTeams from "./pages/ParticipantTeams";
import ParticipantList from "./pages/ParticipantList";

import ScrollToTop from "./utils/scrollToTop"

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/edit-project/:id" element={<EditProject />} />

          {/* New auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Participants views – both under same project */}
          <Route path="/participants/:projectId" element={<ParticipantTeams />} />
          <Route path="/participants/:projectId/list" element={<ParticipantList />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;