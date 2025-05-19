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

function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <Content>
        <Title>Contact Us</Title>
        <Text>
          Got a question or want to say hi?<br />
          Reach us at <strong>support@tripping.com</strong> or connect on social media @trippingapp. <br />
          We're here to help and always happy to chat.
        </Text>
      </Content>
    </Container>
  );
}

export default Contact;
