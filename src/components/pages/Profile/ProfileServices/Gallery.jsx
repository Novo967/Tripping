import React from 'react';
import styled from 'styled-components';
import UploadForm from '../ProfileServices/UploadForm'; // ייבוא ה-UploadForm (compact)
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/**
 * props:
 * photos: array of { filename }
 * email: string
 * onUploadSuccess: fn
 */
const Gallery = ({ photos, email, onUploadSuccess }) => {
  return (
    <GalleryContainer>
      <Header>
        <Title>Gallery</Title>
        <UploadForm compact email={email} onUploadSuccess={onUploadSuccess} />
      </Header>
      <PhotoGrid>
        {photos && photos.length > 0 ? (
          photos.map((photo, index) => (
            <PhotoItem key={index}>
              <img src={`${SERVER_URL}/uploads/${photo.filename}`} alt="Uploaded" />
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
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
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
