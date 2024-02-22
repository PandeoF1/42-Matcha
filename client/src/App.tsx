import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import HomePage from './src/pages/Home';
import RegisterPage from './src/pages/Register';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from "./src/components/Header";
import LoginPage from "./src/pages/Login";
import ValidateEmailPage from "./src/pages/ValidateEmail";
import ProfilePage from "./src/pages/Profile";
import ErrorAlert from "./src/components/ErrorAlert";
import SuccessAlert from "./src/components/SuccessAlert";
import { useState } from "react";
import back from "./assets/back.png"
import ResetPasswordPage from "./src/pages/ResetPassword";
import NotFound from "./src/pages/NotFound";

const theme = createTheme({
  palette: {
    primary: {
      main: "#22242b",
    },
    secondary: {
      main: "#ff6e00",
    },
    background: {
      default: '#18181e',
    },
    error: {
      main: '#FF0000',
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          cursor: "url('./cursor-pointer.png'), auto"
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          cursor: "url('./cursor-pointer.png'), auto"
        },
      },
    },
  }
});

function App() {
  const [errorAlert, setErrorAlert] = useState<string>("")
  const [successAlert, setSuccessAlert] = useState<string>("")
  const [statusList, setStatusList] = useState<any>([])

  return (
    <ThemeProvider theme={theme} >
      {/*Make the background slide to the bottom*/}
      <div className="App w-100" style={{ backgroundImage: `url(${back})`, backgroundSize: "250px 250px", animation: "fallDown 40s infinite linear", backgroundPosition: "center bottom" }}>
        <Router>
          <Header setStatusList={setStatusList} setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />
          <Routes>
            <Route path="/" element={<HomePage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} statusList={statusList} />} />
            <Route path="/register" element={<RegisterPage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
            <Route path="/login" element={<LoginPage setErrorAlert={setErrorAlert} />} />
            <Route path="/validate-email/:id" element={<ValidateEmailPage />} />
            <Route path="/reset-password/:id" element={<ResetPasswordPage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
            <Route path="/reset-password" element={<ResetPasswordPage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
            <Route path="/profile" element={<ProfilePage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ErrorAlert errorAlert={errorAlert} setErrorAlert={setErrorAlert} />
          <SuccessAlert successAlert={successAlert} setSuccessAlert={setSuccessAlert} />
        </Router>
      </div>
    </ThemeProvider >
  )
}

export default App
