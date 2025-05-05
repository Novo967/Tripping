import React from 'react';
import styled from 'styled-components';
import '../App.jsx'
import { Button } from './Button';

const HeroContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.2);
  object-fit: contain;
  position: relative;

  video {
    object-fit: cover;
    display: flex;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: -1;
  }

  h1 {
    color: #fff;
    font-size: 50px;

    @media screen and (max-width: 960px) {
      font-size: 40px;
      margin-top: -5px;
    }

    @media screen and (max-width: 768px) {
      font-size: 30px;
    }
  }

  p {
    color: #fff;
    font-size: 32px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

    @media screen and (max-width: 768px) {
      font-size: 22px;
    }
  }
`;

const HeroButtons = styled.div`
  margin-top: 32px;

  .btn {
    margin: 6px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .btn-mobile {
    display: block;
    text-decoration: none;
  }

  .fa-play-circle {
    margin-left: 4px;
  }
`;

function HeroSection() {
  return (
    <HeroContainer>
      <video src="/videos/video-4.mp4" autoPlay loop muted />
      <h1>Explore the businesses next to you</h1>
      <p>Let's start</p>
      <HeroButtons>
        <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
          Get Started
        </Button>
        <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large'>
          Watch Trailer <i className='far fa-play-circle' />
        </Button>
      </HeroButtons>
    </HeroContainer>
  );
}

export default HeroSection;
