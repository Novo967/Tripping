import React from 'react';
import styled from 'styled-components';

function SecondSection() {
  return (
    <Container>
      <ContentWrapper>
        <TextContainer>
          <Title>About Triping</Title>
          <Description>
            Triping helps travelers connect with others nearby, share their journeys, and find new companions across the globe.
            Whether you're exploring alone or with friends, you'll always have someone to meet along the way.
          </Description>
        </TextContainer>
        <ImageContainer>
          <StyledImage src="/images/backgroundTravel.jpg" alt="Travel background" />
        </ImageContainer>
      </ContentWrapper>
    </Container>
  );
}

// Styled Components
const Container = styled.section`
  background-color: #feb47b;
  color: white;
  padding: 5rem 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1100px;
  margin: 0 auto;
  gap: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContainer = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.8;
  color: #293A40;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 320px;
  transform: rotate(8deg);
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.25);
`;

export default SecondSection;
