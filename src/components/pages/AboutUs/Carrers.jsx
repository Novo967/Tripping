import React, { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #feb47b;
  padding: 6rem 1rem 4rem;
  color: #293A40;
`;

const Content = styled.div`
  max-width: 900px;
  margin: auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 2rem;
`;

const Text = styled.p`
  font-size: 1.25rem;
  line-height: 1.9;
`;

function Careers() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Content>
        <Title>Join Our Journey</Title>
        <Subtitle>Careers at Tripping</Subtitle>
        <Text>
          We’re building something special — a global community of travelers helping each other connect and explore. Whether you're a developer, designer, or storyteller, come shape the future of travel with us.
        </Text>
      </Content>
    </Container>
  );
}

export default Careers;
