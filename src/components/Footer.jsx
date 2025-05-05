import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from './Button';

// Styled Components
const FooterContainer = styled.div`
  background-color: #242424;
  padding: 4rem 0 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FooterSubscription = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 12px;
  padding: 12px;
  color: #fff;

  p {
    font-family: 'Trebuchet MS', sans-serif;
  }
`;

const SubscriptionHeading = styled.p`
  margin-bottom: 12px;
  font-size: 24px;
`;

const SubscriptionText = styled.p`
  margin-bottom: 12px;
  font-size: 20px;
`;

const InputArea = styled.div`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    padding: 8px 20px;
    border-radius: 2px;
    margin: 4px 0 10px 0;
    outline: none;
    border: 1px solid #fff;
    font-size: 18px;
    ::placeholder {
      color: #b1b1b1;
    }
  }

  @media screen and (min-width: 820px) {
    form {
      flex-direction: row;
    }

    input {
      margin-right: 10px;
      margin-bottom: 0;
    }
  }
`;

const FooterLinks = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 820px) {
    padding-top: 2rem;
  }
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
  margin: 16px;
  width: 160px;

  h2 {
    color: #fff;
    margin-bottom: 16px;
  }

  a {
    color: #fff;
    text-decoration: none;
    margin-bottom: 0.5rem;
    &:hover {
      color: #e9e9e9;
      transition: 0.3s ease-out;
    }
  }
`;

const SocialMedia = styled.section`
  max-width: 1000px;
  width: 100%;
`;

const SocialMediaWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1000px;
  margin: 40px auto 0 auto;

  @media screen and (max-width: 820px) {
    flex-direction: column;
  }
`;

const FooterLogo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 2rem;
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 16px;
  cursor: pointer;

  i {
    margin-left: 5px;
  }
`;

const WebsiteRights = styled.small`
  color: #fff;
  font-size: 16px;
  margin-bottom: 16px;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 240px;
`;

const SocialIconLink = styled(Link)`
  color: #fff;
  font-size: 24px;
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
            <h2>About us</h2>
            <Link to="#">How it works</Link>
            <Link to="#">Our vision</Link>
            <Link to="#">Who we are</Link>
            <Link to="#">Support us</Link>
          </FooterLinkItems>
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
            Close2Home <i className="fa-solid fa-shop" />
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
