import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from './Button';

const FooterContainer = styled.footer`
  background-color:rgba(18, 17, 17, 0.6);
  padding: 4rem 1rem 2rem;
  color:rgb(250, 243, 243);
`;

const FooterTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #8493a6;
  }

  a {
    color:rgb(221, 31, 56);
    text-decoration: none;
    margin-bottom: 0.5rem;
    font-size: 1rem;

    &:hover {
      color:rgb(211, 230, 228);
      transition: 0.3s ease;
    }
  }
`;

const SubscriptionBox = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #8493a6;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  input {
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    margin-right: 0.5rem;
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
      flex-direction: column;
      align-items: center;
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

function Footer() {
  return (
    <FooterContainer>
      <FooterTop>
        <FooterSection>
          <h3>About Us</h3>
          <Link to="#">How it works</Link>
          <Link to="#">Our vision</Link>
          <Link to="#">Who we are</Link>
          <Link to="#">Support us</Link>
        </FooterSection>

        <FooterSection>
          <h3>Community</h3>
          <Link to="#">Join us</Link>
          <Link to="#">Contribute</Link>
          <Link to="#">Events</Link>
          <Link to="#">Help center</Link>
        </FooterSection>

        <FooterSection>
          <h3>Social</h3>
          <Link to="#">Facebook</Link>
          <Link to="#">Instagram</Link>
          <Link to="#">Twitter</Link>
          <Link to="#">TikTok</Link>
        </FooterSection>
      </FooterTop>

      <SubscriptionBox>
        <h2>Join our community</h2>
        <p>It's free, inspiring, and just one click away.</p>
        <form>
          <input type="email" placeholder="Your email" />
          <Button buttonStyle="btn--outline">Sign Up</Button>
        </form>
      </SubscriptionBox>

      <SocialBar>
        <Logo to="/">
          Triping <i className="fa-solid fa-location-dot" />
        </Logo>
        <Rights>© 2025 Triping. All rights reserved.</Rights>
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
