import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from './Button';

// Styled Components
const Container = styled.section`
  position: relative;
  padding: 6rem 2rem 4rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(38, 47, 55, 0.7)),
    url('/images/backgroundTravel.jpg') center/cover no-repeat;
  color: white;
  overflow: hidden;
  height: 600px;
  border-top: 30px solid transparent;

  &::before {
    content: "";
    position: absolute;
    top: -30px;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1120px;
  width: 90%;
  margin: 0 auto;
  position: relative;
  z-index: 3;
`;

const HeroText = styled.h2`
  color: white;
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SubText = styled.p`
  color: #e0e0e0;
  font-size: 1.2rem;
  text-align: center;
  max-width: 700px;
  margin-bottom: 2.5rem;
`;

function SecondSection() {
  return (
    <Container>
      <InnerContainer>
        <HeroText>Make friends easy, any time, any place</HeroText>
        <SubText>With Triping you can explore new people around the World</SubText>
        <Button className='btns' to='/login' buttonStyle='btn--outline' buttonSize='btn--large'>
          Get Started <i className="fas fa-map-marker-alt" />
        </Button>
      </InnerContainer>
    </Container>
  );
}

export default SecondSection;
