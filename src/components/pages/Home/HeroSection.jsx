import React from 'react';
import styled from 'styled-components';
import '../../../App.jsx';
import { Button } from '../../Service/Button.jsx';

function HeroSection() {
  return (
    <HeroContainer>
      <Overlay />
      <BottomGradient />
      <Content>
        <h1>Explore travelers</h1>
        <h2>Around you</h2>
        <p>Join the community</p>
        <HeroButtons>
          <Button className='btns' to='/login' buttonStyle='btn--outline' buttonSize='btn--large'>
            Get Started <i className="fas fa-map-marker-alt" />
          </Button>
          <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large'>
            Watch Trailer <i className='far fa-play-circle' />
          </Button>   
        </HeroButtons>
      </Content>
    </HeroContainer>
  );
}

  const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), 
            url('/images/heroSectionPic.jpg') center/cover no-repeat;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: -1;
`;

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 40%;
  width: 100%;
  background: linear-gradient(to top, rgba(217, 192, 188, 0.6), transparent);
  z-index: -1;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  color: #fff;
  padding: 0 40px;

  h1 {
  font-size: 4.15rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
  letter-spacing: 1px;
  padding-top: 20vh;

  @media screen and (max-width: 960px) {
    font-size: 2.4rem;
  }

  @media screen and (max-width: 600px) {
    font-size: 2rem;
  }
}

h2 {
  font-size: 7rem;
  font-weight: 700;
  margin: 0rem 0 2rem;
  color: #feb47b;
  line-height: 1.2;
  letter-spacing: 1.5px;
  text-shadow: 2px 2px 10px rgba(0,0,0,0.4);

  @media screen and (max-width: 960px) {
    font-size: 4rem;
  }

  @media screen and (max-width: 600px) {
    font-size: 3rem;
  }
}


  p {
    color: #fff;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;

    @media screen and (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  .btn {
    padding: 14px 30px;
    font-size: 1rem;
    border-radius: 30px;
    font-weight: 600;
    box-shadow: 0 6px 12px rgba(0,0,0,0.25);
    transition: all 0.3s ease-in-out;
  }

  i {
      margin-left: 8px;
    }

    }
  .fa-play-circle {
    margin-left: 8px;
  }
`;

export default HeroSection;
