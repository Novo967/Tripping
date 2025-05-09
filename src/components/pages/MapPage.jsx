import React from 'react';
import styled from 'styled-components';
import MapContainer from '../Service/MapContainer';

const Service = () => {
  return (
    <ServiceContainer>
      <h1>Explore people around you</h1>
      <MapContainer />
    </ServiceContainer>
  );
};

export default Service;

// styled-components
const ServiceContainer = styled.div`
  margin-top: 100px;
  padding: 10px;
  text-align: center;
`;

const h1 = styled.div`
  color: white;
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 5px;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;
