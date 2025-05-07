// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: rgba(18, 17, 17, 0.6);
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  position: fixed;
  top: 0;
  z-index: 999;
  backdrop-filter: blur(8px);
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
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
    color:rgb(254, 197, 123);
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
  align-items: center;
  list-style: none;

  @media screen and (max-width: 960px) {
    flex-direction: column;
    width: 100%;
    height: 90vh;
    position: absolute;
    top: 80px;
    left: ${({ active }) => (active ? '0' : '-100%')};
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
      background:rgb(181, 149, 149);
      color: #fff;
    }
  }
`;

const MobileLink = styled(Link)`
  display: none;

  @media screen and (max-width: 960px) {
    display: block;
    margin: 20px auto;
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

const WelcomeMessage = styled.span`
  margin-left: 20px;
  color: #fff;
  font-size: 1rem;
  font-weight: 400;

  @media screen and (max-width: 690px) {
    display: none;
  }
`;

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [username, setUsername] = useState(null);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    setButton(window.innerWidth > 960);
  };

  useEffect(() => {
    showButton();
    const storedName = localStorage.getItem('name');
    setUsername(storedName || null);

    window.addEventListener('resize', showButton);
    return () => window.removeEventListener('resize', showButton);
  }, []);

  return (
    <NavbarContainer>
      <Container>
        <Logo to='/' onClick={closeMobileMenu}>
          Triping <i className='fa-solid fa-location-dot' />
        </Logo>

        {username && <WelcomeMessage>Welcome, {username}!</WelcomeMessage>}

        <MenuIcon onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </MenuIcon>

        <NavMenu active={click}>
          <NavItem>
            <NavLink to='/' onClick={closeMobileMenu}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to='/services' onClick={closeMobileMenu}>Map</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to='/profile' onClick={closeMobileMenu}>Profile</NavLink>
          </NavItem>
          <NavItem>
            <MobileLink to='/sign-up' onClick={closeMobileMenu}>Sign Up</MobileLink>
          </NavItem>
        </NavMenu>

        {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>}
      </Container>
    </NavbarContainer>
  );
}

export default Navbar;
