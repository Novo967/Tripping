import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home/HomePage';
import MapPage from './components/pages/Map/MapPage';
import Profile from './components/pages/Profile/ProfilePage';
import SignUp from './components/pages/UserSign/SignUp';
import Navbar from './components/Service/Navbar';
import Footer from './components/Service/Footer';
import VisitorProfile from './components/pages/Profile/VisitorProfile';
import LogingIn from './/components/pages/UserSign/LogingIn';
import OurStory from './components/pages/AboutUs/OurStory';
import Careers from './components/pages/AboutUs/Carrers';
import Contact from './components/pages/AboutUs/Contact';
import 'leaflet/dist/leaflet.css';
import { UserProvider } from './components/pages/UserSign/UserContext';

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
    <UserProvider>
      <Router>
        <GlobalStyle />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/MapPage' element={<MapPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/login' element={<LogingIn />} />
          <Route path="/visitor/:email" element={<VisitorProfile />} />
          <Route path="/OurStory" element={<OurStory />} />
          <Route path="/Careers" element={<Careers />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
