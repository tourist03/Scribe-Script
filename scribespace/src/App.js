import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/JS/Home";
import About from "./components/JS/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/JS/Alert";
import Login from "./components/JS/Login";
import SignUp from "./components/JS/Signup";
import { useState } from "react";
import PrivateRoute from "./components/JS/PrivateRoute";
import TemporaryNote from "./components/JS/TemporaryNote";
import TemporaryCanvas from "./components/JS/TemporaryCanvas";
import ToggleRoute from "./components/JS/toggleRoute";
import Drawings from "./components/JS/Drawings";
import SavedWork from "./components/JS/SavedWork";
import TopNav from "./components/JS/TopNav";
import DrawingCanvas from "./components/JS/DrawingCanvas";
import ResetPassword from './components/JS/ResetPassword';
import BetaBanner from './components/JS/BetaBanner';
import { AuthProvider } from './context/AuthContext';

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
    <AuthProvider>
      <NoteState>
        <Router>
          <div className="app-wrapper">
            <TopNav />
            <BetaBanner />
            <div className="page-container">
              <div className="container">
                <Alert alert={alert} />
                <Routes>
                  <Route path="/" element={<ToggleRoute />} />
                  <Route 
                    path="/notes" 
                    element={
                      <PrivateRoute>
                        <Home showAlert={showAlert} />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login showAlert={showAlert} />} />
                  <Route path="/signup" element={<SignUp showAlert={showAlert} />} />
                  <Route path="/tempDraw" element={<TemporaryCanvas showAlert={showAlert} />} />
                  <Route path="/tempNote" element={<TemporaryNote showAlert={showAlert} />} />
                  <Route 
                    path="/drawings" 
                    element={
                      <PrivateRoute>
                        <Drawings showAlert={showAlert} />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/saved-work" 
                    element={
                      <PrivateRoute>
                        <SavedWork showAlert={showAlert} />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/drawing" 
                    element={
                      <PrivateRoute>
                        <DrawingCanvas showAlert={showAlert} />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/reset-password/:token" element={<ResetPassword showAlert={showAlert} />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </NoteState>
    </AuthProvider>
  );
}

export default App;
