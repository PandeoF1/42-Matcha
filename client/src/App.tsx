import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import HomePage from './src/pages/Home';
import RegisterPage from './src/pages/Register';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from "./src/components/header";
import LoginPage from "./src/pages/Login";
import ValidateEmailPage from "./src/pages/ValidateEmail";

const theme = createTheme({
  palette: {
    primary: {
      main: '#892CDC',
    },
    secondary: {
      main: "##ff6e00",
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
      <header className="App-header w-100">
        <Header />
      </header>
      <body className="App-body">
        <div className="App w-100">
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/validate-email/:id" element={<ValidateEmailPage/>} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </Router>
        </div>
      </body>
    </ThemeProvider>
  )
}

export default App
