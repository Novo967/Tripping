import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import MapPage from './components/pages/MapPage';
import Profile from './components/pages/Profile';
import SignUp from './components/pages/SignUp';
import Footer from './components/Footer';
import LogingIn from './components/pages/LogingIn';
import 'leaflet/dist/leaflet.css';

// גלובלי לכל האפליקציה
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'PT Sans', sans-serif;
    scroll-behavior: smooth;
  }
`;

// קומפוננטות עם רקעים שונים
const PageWrapper = styled.div`
  display: flex;
  height: 90vh;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #fff;
  background-image: url('/images/pic2.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/MapPage' element={<MapPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/login' element={<LogingIn />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
