import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from './Button';

// Colors for travel-themed vibe
const colors = {
  background: '#f0f4f3',
  text: '#2c3e50',
  link: '#1abc9c',
  hover: '#16a085',
  border: '#dcdcdc',
};

// Styled Components
const FooterContainer = styled.div`
  background-color: ${colors.background};
  padding: 4rem 0 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FooterSubscription = styled.section`
  text-align: center;
  color: ${colors.text};
  margin-bottom: 2rem;
  padding: 0 1rem;

  p {
    font-family: 'Segoe UI', sans-serif;
    margin: 0.5rem 0;
  }
`;

const SubscriptionHeading = styled.p`
  font-size: 1.8rem;
  font-weight: 600;
`;

const SubscriptionText = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const InputArea = styled.div`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: 1px solid ${colors.border};
    margin: 8px 0;
    font-size: 1rem;
    width: 250px;
    max-width: 90%;
    ::placeholder {
      color: #999;
    }
  }

  @media screen and (min-width: 768px) {
    form {
      flex-direction: row;
    }

    input {
      margin: 0 1rem 0 0;
    }
  }
`;

const FooterLinks = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const FooterLinkWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;

  @media screen and (max-width: 820px) {
    flex-direction: column;
  }
`;

const FooterLinkItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 140px;

  h2 {
    color: ${colors.text};
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  a {
    color: ${colors.link};
    text-decoration: none;
    margin-bottom: 0.5rem;
    font-size: 1rem;

    &:hover {
      color: ${colors.hover};
      transition: 0.3s ease-in-out;
    }
  }
`;

const SocialMedia = styled.section`
  width: 100%;
  max-width: 1100px;
  margin-top: 2rem;
`;

const SocialMediaWrap = styled.div`
   display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  border-top: 1px solid ${colors.border};

  @media screen and (max-width: 820px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterLogo = styled(Link)`
  color: ${colors.text};
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;;

  i {
    margin-left: 5px;
  }
`;

const WebsiteRights = styled.small`
  color: #fff;
  font-size: 0.9rem;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 240px;
`;

const SocialIconLink = styled(Link)`
  color: ${colors.link};
  font-size: 1.5rem;

  &:hover {
    color: ${colors.hover};
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterLinks>
        <FooterLinkWrapper>
          <FooterLinkItems>
            <h2>About us</h2>
            <Link to="#">How it works</Link>
            <Link to="#">Our vision</Link>
            <Link to="#">Who we are</Link>
            <Link to="#">Support us</Link>
          </FooterLinkItems>
          <FooterLinkItems>
            <h2>About us</h2>
            <Link to="#">How it works</Link>
            <Link to="#">Our vision</Link>
            <Link to="#">Who we are</Link>
            <Link to="#">Support us</Link>
          </FooterLinkItems>
        </FooterLinkWrapper>
        <FooterLinkWrapper>
          <FooterLinkItems>
            <h2>Social media</h2>
            <Link to="#">Facebook</Link>
            <Link to="#">Instagram</Link>
            <Link to="#">Twitter</Link>
            <Link to="#">Tiktok</Link>
          </FooterLinkItems>
        </FooterLinkWrapper>
      </FooterLinks>

      <FooterSubscription>
        <SubscriptionHeading>Join to our community</SubscriptionHeading>
        <SubscriptionText>It's for free!</SubscriptionText>
        <InputArea>
          <form>
            <input type="email" name="email" placeholder="Your email" />
            <Button buttonStyle="btn--outline">Sign up</Button>
          </form>
        </InputArea>
      </FooterSubscription>
      <SocialMedia>
        <SocialMediaWrap>
          <FooterLogo to="/">
            Triping <i className="fa-solid fa-shop" />
          </FooterLogo>
          <WebsiteRights>© 2025</WebsiteRights>
          <SocialIcons>
            <SocialIconLink to="/" target="_blank" aria-label="Facebook">
              <i className="fab fa-facebook-f" />
            </SocialIconLink>
            <SocialIconLink to="/" target="_blank" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </SocialIconLink>
            <SocialIconLink to="/" target="_blank" aria-label="Twitter">
              <i className="fab fa-twitter" />
            </SocialIconLink>
            <SocialIconLink to="/" target="_blank" aria-label="Tiktok">
              <i className="fab fa-tiktok" />
            </SocialIconLink>
          </SocialIcons>
        </SocialMediaWrap>
      </SocialMedia>
    </FooterContainer>
  );
}

export default Footer;
