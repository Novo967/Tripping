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

const Text = styled.p`
  font-size: 1.25rem;
  line-height: 1.9;
`;

function OurStory() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Content>
        <Title>Our Story</Title>
        <Text>
          Tripping began as a dream between two friends who wanted to make meaningful connections while traveling. <br />
          Today, it’s a vibrant platform helping thousands of travelers meet, share, and explore together. <br />
          Because we believe the journey is always better when it's shared.
        </Text>
      </Content>
    </Container>
  );
}

export default OurStory;
