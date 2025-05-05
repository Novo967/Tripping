import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Components
const CardsContainer = styled.div`
  padding: 4rem;
  background: #ffffff04;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  max-width: 1120px;
  width: 90%;
  margin: 0 auto;
`;

const Wrapper = styled.div`
  position: relative;
  margin: 50px 0 45px;
`;

const Items = styled.ul`
  margin-bottom: 24px;

  @media only screen and (min-width: 1024px) {
    display: flex;
  }
`;

const Card = styled.li`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 600px;
  margin: 0 1rem;

  @media only screen and (max-width: 1024px) {
    margin-bottom: 2rem;
  }
`;

const CardLink = styled(Link)`
  display: flex;
  flex-flow: column;
  width: 100%;
  box-shadow: 0 6px 20px rgba(56, 125, 255, 0.17);
  filter: drop-shadow(0 6px 20px rgba(56, 125, 255, 0.017));
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
`;

const PicWrap = styled.div`
  position: relative;
  width: 100%;
  padding-top: 67%;
  overflow: hidden;

  &::after {
    content: attr(data-category);
    position: absolute;
    bottom: 0;
    margin-left: 10px;
    padding: 6px 8px;
    max-width: calc(100% - 60px);
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    background-color: #1f98f4;
    box-sizing: border-box;
  }
`;

const CardImg = styled.img`
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.2s linear;

  &:hover {
    transform: scale(1.1);
  }
`;

const Info = styled.div`
  padding: 20px 30px 30px;
`;

const Text = styled.h5`
  color: #000;
  font-size: 18px;
  line-height: 24px;
`;

// Component for single card
const CardItem = ({ src, text, label, path }) => {
  return (
    <Card>
      <CardLink to={path}>
        <PicWrap data-category={label}>
          <CardImg src={src} alt="Card" />
        </PicWrap>
        <Info>
          <Text>{text}</Text>
        </Info>
      </CardLink>
    </Card>
  );
};

// Main Cards component
function Cards() {
  return (
    <CardsContainer>
      <InnerContainer>
        <Wrapper>
          <Items>
            <CardItem 
              src="images/pic3.png"
              text="Our local shops"
              label="Near by"
              path="/services"
            />
            <CardItem 
              src="images/pic4.jpg"
              text="Read about our Miluim busineses"
              label="Israeli businesses"
              path="/services"
            />
          </Items>
        </Wrapper>
      </InnerContainer>
    </CardsContainer>
  );
}

export default Cards;
