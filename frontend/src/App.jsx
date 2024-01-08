import './App.css';

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './userContext';
import LandingPage from './routes/LandingPage';
import ResultPage from './routes/ResultPage';
import AppHeader from './components/AppHeader';
import CuTextField from './components/CuTextField';
import { ThemeProvider } from "@mui/material/styles";
import { CuTheme } from './theme';
import AppDrawer from './components/AppDrawer';

function App() {
  return (
    <>
      <ThemeProvider theme={CuTheme}>
        <UserContextProvider>
          <BrowserRouter>
            <AppHeader />
            <AppDrawer />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </UserContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
