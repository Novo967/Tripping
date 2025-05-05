import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: linear-gradient(90deg, rgb(28, 27, 27) 0%, rgb(26, 23, 23) 100%);
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  max-width: 1500px;
  width: 100%;
`;

const Logo = styled(Link)`
  color: #fff;
  justify-self: start;
  margin-left: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 2rem;
  display: flex;
  align-items: center;
  position: relative;
  transform: translate(0, 0);

  @media screen and (max-width: 960px) {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(25%, 50%);
  }
`;

const MenuIcon = styled.div`
  display: none;

  @media screen and (max-width: 960px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
  }
`;

const NavMenu = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-gap: 10px;
  list-style: none;
  text-align: center;
  width: 60vw;
  justify-content: end;
  margin-right: 2rem;

  @media screen and (max-width: 960px) {
    flex-direction: column;
    display: ${({ active }) => (active ? 'flex' : 'none')};
    width: 100%;
    height: 90vh;
    position: absolute;
    top: 80px;
    left: 0;
    background: #242222;
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
  text-decoration: none;
  padding: 0.5rem 1rem;
  height: 100%;

  &:hover {
    border-bottom: 4px solid #fff;
    transition: all 0.2s ease-out;

    @media screen and (max-width: 960px) {
      background-color: #fff;
      color: #242424;
      border-bottom: none;
      width: 100%;
      display: table;
      text-align: center;
    }
  }
`;

const MobileLink = styled(Link)`
  display: none;

  @media screen and (max-width: 960px) {
    display: block;
    text-align: center;
    margin: 2rem auto;
    border-radius: 4px;
    width: 80%;
    text-decoration: none;
    font-size: 1.5rem;
    background-color: transparent;
    color: #fff;
    padding: 14px 20px;
    border: 1px solid #fff;
    transition: all 0.3s ease-out;

    &:hover {
      background: #fff;
      color: #242424;
      transition: 250ms;
    }
  }
`;

const WelcomeMessage = styled.span`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  font-weight: 500;
  color: white;

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
    <>
      <NavbarContainer>
        <Container>
          <Logo to='/' onClick={closeMobileMenu}>
            Close2Home
            <i className='fa-solid fa-shop' />
          </Logo>

          {username && <WelcomeMessage>Welcome, {username}!</WelcomeMessage>}

          <MenuIcon onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </MenuIcon>

          <NavMenu active={click}>
            <NavItem>
              <NavLink to='/' onClick={closeMobileMenu}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to='/services' onClick={closeMobileMenu}>
                Services
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to='/profile' onClick={closeMobileMenu}>
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <MobileLink to='/sign-up' onClick={closeMobileMenu}>
                Sign Up
              </MobileLink>
            </NavItem>
          </NavMenu>

          {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>}
        </Container>
      </NavbarContainer>
    </>
  );
}

export default Navbar;
