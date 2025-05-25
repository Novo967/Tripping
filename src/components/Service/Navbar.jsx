import React, { useState, useEffect, useContext } from 'react';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserContext } from '../pages/UserSign/UserContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const NavbarContainer = styled.nav`
  background: #293A40;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between; /* לוגו משמאל, כל השאר מימין */
  align-items: center;
  font-size: 1.2rem;
  position: fixed;
  top: 0;
  z-index: 999;
  padding: 0 20px;
  backdrop-filter: blur(8px);
`;

const Logo = styled(Link)`
  color: #fff;
  font-size: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
  i {
    margin-left: 8px;
    color: #feb47b;
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* ריווח קטן בין הכפתורים */
`;

const WelcomeMessage = styled.span`
  color: #fff;
  font-size: 1rem;
  font-weight: 400;

  @media screen and (max-width: 690px) {
    display: none;
  }
`;

const MenuIcon = styled.div`
  display: none;

  @media screen and (max-width: 960px) {
    display: block;
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  @media screen and (max-width: 960px) {
    position: absolute;
    top: 80px;
    right: ${({ active }) => (active ? '0' : '-100%')};
    width: 100%;
    height: 90vh;
    flex-direction: column;
    background: #121212;
    transition: all 0.5s ease;
    z-index: 1;
  }
`;

const NavItem = styled.li`
  height: 80px;
`;

const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  text-decoration: none;
  height: 100%;
  font-weight: 500;

  &:hover {
    color: #feb47b;
    transition: 0.3s;
  }

  @media screen and (max-width: 960px) {
    padding: 1.5rem;
    width: 100%;
    text-align: center;
    justify-content: center;

    &:hover {
      background: rgb(181, 149, 149);
      color: #fff;
    }
  }
`;

const MobileLink = styled(Link)`
  display: none;

  @media screen and (max-width: 960px) {
    display: block;
    margin: 2px auto;
    font-size: 1.4rem;
    color: #fff;
    border: 1px solid #fff;
    padding: 12px 24px;
    border-radius: 30px;
    text-decoration: none;

    &:hover {
      background: #fff;
      color: #121212;
      transition: 0.3s ease-in-out;
    }
  }
`;

const ChatIcon = styled.div`
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #feb47b;
  }
`;

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const navigate = useNavigate();
  const { username, logout } = useContext(UserContext);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    setButton(window.innerWidth > 960);
  };

  useEffect(() => {
    showButton();
    window.addEventListener('resize', showButton);
    return () => window.removeEventListener('resize', showButton);
  }, []);

  const handleSignOut = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      await fetch(`${SERVER_URL}/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      localStorage.removeItem('userEmail');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <NavbarContainer>
      <Logo to='/' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Tripping <i className='fa-solid fa-location-dot' />
      </Logo>

      <RightContainer>
        {username && <WelcomeMessage>Welcome, {username}!</WelcomeMessage>}

        <MenuIcon onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </MenuIcon>
        <NavMenu active={click}>
          <NavItem>
            <NavLink to='/' onClick={closeMobileMenu}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to='/MapPage' onClick={closeMobileMenu}>Map</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to='/profile' onClick={closeMobileMenu}>Profile</NavLink>
          </NavItem>
          {username ? (
            <NavItem>
              <NavLink to='#' onClick={handleSignOut}>Sign Out</NavLink>
            </NavItem>
          ) : (
            /* כאן אם במצב מובייל (button == false) מציגים קישור רגיל בתפריט */
            !button && (
              <NavItem>
                <NavLink to='/sign-up' onClick={closeMobileMenu}>Sign Up</NavLink>
              </NavItem>
            )
          )}
        </NavMenu>

        {/* הכפתור הגדול יופיע רק במסך גדול (button == true) ואין משתמש */}
        {button && !username && (
          <Button to='/login' buttonStyle='btn--outline'>SIGN UP</Button>
        )}

        <ChatIcon onClick={() => navigate('/chats')} title='Chats'>
          <i className='fas fa-paper-plane' />
        </ChatIcon>
      </RightContainer>
    </NavbarContainer>
  );
}

export default Navbar;
