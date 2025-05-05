import React from 'react';
import styled from 'styled-components';

const Gallery = ({ photos }) => {
  return (
    <GalleryContainer>
      <h2>Gallery</h2>
      <PhotoGrid>
        {photos && photos.length > 0 ? (
          photos.map((photo, index) => (
            <PhotoItem key={index}>
              <img src={`https://reactwebsite-2.onrender.com/uploads/${photo.filename}`} alt="Uploaded" />
            </PhotoItem>
          ))
        ) : (
          <NoPhotos>No photos uploaded yet.</NoPhotos>
        )}
      </PhotoGrid>
    </GalleryContainer>
  );
};

export default Gallery;

// styled-components
const GalleryContainer = styled.div`
  padding: 20px;
  margin-top: 30px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
`;

const PhotoItem = styled.div`
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const NoPhotos = styled.p`
  color: #777;
  font-style: italic;
`;
