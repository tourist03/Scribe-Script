import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import SignUp from "./components/signup";
import { useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import TemporaryNote from "./components/TemporaryNote";
import TemporaryCanvas from "./components/TemporaryCanvas";
import ToggleRoute from "./components/toggleRoute";
import Drawings from "./components/Drawings";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Home showAlert={showAlert} />
                </PrivateRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/tempNote" element={<TemporaryNote />} />
            <Route path="/signup" element={<SignUp showAlert={showAlert} />} />
            <Route path="/tempDraw" element={<TemporaryCanvas />} />
            <Route path="/choose" element={<ToggleRoute />} />
            <Route 
              path="/drawings" 
              element={
                <PrivateRoute>
                  <Drawings showAlert={showAlert} />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
