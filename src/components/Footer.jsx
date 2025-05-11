import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from './Button';

const FooterContainer = styled.footer`
  background: rgba(18, 17, 17, 0.6);
  backdrop-filter: blur(8px);
  color: #f0f0f0;
  padding: 4rem 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
   max-width: 1200px;
  margin: 0 auto 3rem;
  gap: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
     color: #feb47b;
    letter-spacing: 0.5px;
  }

  a {
    color: #dcdcdc;
    text-decoration: none;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    transition: 0.3s ease;

    &:hover {
      color: #fff;
      transition: 0.3s ease;
    }
  }
`;

const SubscriptionBox = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #feb47b;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #ccc;
  }

  input {
    padding: 0.6rem 1rem;
    border-radius: 25px;
    border: none;
    font-size: 1rem;
    width: 250px;
    max-width: 90%;
  }

  @media (max-width: 768px) {
    input {
      margin-bottom: 1rem;
      margin-right: 0;
    }

    form {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
`;

const SocialBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-top: 1px solid #ccc;
  padding-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: bold;
  color:rgb(248, 243, 243);
  text-decoration: none;

  i {
    margin-left: 8px;
    color:rgb(237, 243, 241);
  }
`;

const Rights = styled.small`
  color: #fff;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.2rem;

  a {
    font-size: 1.4rem;
    color:rgb(218, 227, 224);

    &:hover {
      color:rgb(222, 234, 231);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  color: #aaa;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterTop>
        <FooterSection>
          <h3>About Us</h3>
          <Link to='/'>Our Story</Link>
          <Link to='/'>Careers</Link>
          <Link to='/'>Contact</Link>
        </FooterSection>

        <FooterSection>
          <h3>Explore</h3>
          <Link to='/'>Map</Link>
          <Link to='/'>Profiles</Link>
          <Link to='/'>Communities</Link>
        </FooterSection>

        <FooterSection>
          <h3>Follow</h3>
          <a href='https://instagram.com'>Instagram</a>
          <a href='https://facebook.com'>Facebook</a>
          <a href='https://twitter.com'>Twitter</a>
        </FooterSection>
      </FooterTop>
      <FooterBottom/>
      <SubscriptionBox>
        <h2>Stay Connected</h2>
        <p>Get updates and news directly to your inbox</p>
        <form>
          <input type="email" placeholder="Enter your email" />
          <Button buttonStyle='btn--outline'>Subscribe</Button>
        </form>
      </SubscriptionBox>
      <SocialBar>
        <Logo to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Triping <i className="fa-solid fa-location-dot" />
        </Logo>
          © {new Date().getFullYear()} Triping. All rights reserved.
        <SocialIcons>
          <Link to="#"><i className="fab fa-facebook-f" /></Link>
          <Link to="#"><i className="fab fa-instagram" /></Link>
          <Link to="#"><i className="fab fa-twitter" /></Link>
          <Link to="#"><i className="fab fa-tiktok" /></Link>
        </SocialIcons>
      </SocialBar>
    </FooterContainer>
  );
}

export default Footer;

