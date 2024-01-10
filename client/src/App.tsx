import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import HomePage from './src/pages/Home';
import RegisterPage from './src/pages/Register';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from "./src/components/header";

const theme = createTheme({
  palette: {
    primary: {
      main: '#892CDC',
    },
    secondary: {
      main: '#BC6FF1',
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Router>
        </div>
      </body>
    </ThemeProvider>
  )
}

export default App
