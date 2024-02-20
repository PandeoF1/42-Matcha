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
import { useEffect, useState } from "react";
import MapDebug from "./src/pages/MapDebug";
import back from "./assets/back.png"
import MouseParticles from 'react-mouse-particles'

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
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          cursor: "url('./test.png'), pointer"
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          cursor: "url('./test.png'), pointer"
        },
      },
    },
}});


function App() {
  const [errorAlert, setErrorAlert] = useState<string>("")
  const [successAlert, setSuccessAlert] = useState<string>("")
  const [statusList, setStatusList] = useState<any>([])

  useEffect(() => {
    console.log("statusList", statusList)
  }
  , [statusList])
  return (
    <ThemeProvider theme={theme} >
      {/*Make the background slide to the bottom*/}
      <div className="App w-100" style={{backgroundImage: `url(${back})`, backgroundSize: "250px 250px", animation: "fallDown 40s infinite linear"}}>
          <Router>
            <Header setStatusList={setStatusList} setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />
            <Routes>
              <Route path="/" element={<HomePage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} statusList={statusList} />} />
              <Route path="/register" element={<RegisterPage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
              <Route path="/login" element={<LoginPage setErrorAlert={setErrorAlert} />} />
              <Route path="/validate-email/:id" element={<ValidateEmailPage />} />
              <Route path="/profile" element={<ProfilePage setErrorAlert={setErrorAlert} setSuccessAlert={setSuccessAlert} />} />
              <Route path="/geolocall" element={<MapDebug />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
            <ErrorAlert errorAlert={errorAlert} setErrorAlert={setErrorAlert} />
            <SuccessAlert successAlert={successAlert} setSuccessAlert={setSuccessAlert} />
          </Router>
      </div>
      <MouseParticles g={1} num={6} color="#ff4fc4" cull="stats,image-wrapper" level={6} />
    </ThemeProvider >
  )
}

export default App
