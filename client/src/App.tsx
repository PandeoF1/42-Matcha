import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import HomePage from './src/pages/Home';
import RegisterPage from './src/pages/Register';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from "./src/components/header";
import LoginPage from "./src/pages/Login";
import ValidateEmailPage from "./src/pages/ValidateEmail";
import ProfilePage from "./src/pages/Profile";

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
  return (
    <ThemeProvider theme={theme}>
      <div className="App w-100">
        <Header />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/validate-email/:id" element={<ValidateEmailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider >
  )
}

export default App
