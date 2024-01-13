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

const theme = createTheme({
  palette: {
    primary: {
      main: "#143857",
    },
    secondary: {
      main: "#ff6e00",
    },
    background: {
      default: '#0b1f30',
    },
    error: {
      main: '#FF0000',
    },
  },
});


function App() {
  const [errorAlert, setErrorAlert] = useState<string>("")
  const [successAlert, setSuccessAlert] = useState<string>("")

  return (
    <ThemeProvider theme={theme}>
      <div className="App w-100">
        <Router>
          <Header setErrorAlert={setErrorAlert} />
          <Routes>
            <Route path="/" element={<HomePage setErrorAlert={setErrorAlert} />} />
            <Route path="/register" element={<RegisterPage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
            <Route path="/login" element={<LoginPage setErrorAlert={setErrorAlert} />} />
            <Route path="/validate-email/:id" element={<ValidateEmailPage />} />
            <Route path="/profile" element={<ProfilePage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
          <ErrorAlert errorAlert={errorAlert} setErrorAlert={setErrorAlert} />
          <SuccessAlert successAlert={successAlert} setSuccessAlert={setSuccessAlert} />
        </Router>
      </div>
    </ThemeProvider >
  )
}

export default App
