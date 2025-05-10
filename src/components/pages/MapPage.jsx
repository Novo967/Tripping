import React from 'react';
import styled from 'styled-components';
import MapContainer from '../Service/MapContainer';

const Service = () => {
  return (
    <ServiceContainer>
      <MapContainer />
    </ServiceContainer>
  );
};

export default Service;

// styled-components
const ServiceContainer = styled.div`
  text-align: center;
`;


