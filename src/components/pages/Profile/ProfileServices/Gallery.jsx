import React, { useState } from 'react';
import styled from 'styled-components';
import UploadForm from '../ProfileServices/UploadForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/**
 * props:
 * photos: array of { filename }
 * email: string
 * onUploadSuccess: fn
 * onDeletePhoto: fn to update parent state after deletion
 */
const Gallery = ({ photos, email, onUploadSuccess, onDeletePhoto }) => {
  const [modalImg, setModalImg] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const openModal = (photo) => {
    setCurrentFile(photo.filename);
    setModalImg(`${SERVER_URL}/uploads/${photo.filename}`);
  };
  const closeModal = () => setModalImg(null);

  const handleDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}/api/photo`, {
        data: { filename: currentFile, email }
      });
      onDeletePhoto(currentFile);
      closeModal();
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  return (
    <GalleryContainer>
      <Header>
        <Title>Gallery</Title>
        <UploadForm compact email={email} onUploadSuccess={onUploadSuccess} />
      </Header>
      <PhotoGrid>
        {photos && photos.length > 0 ? (
          photos.map((photo, idx) => (
            <PhotoItem key={idx} onClick={() => openModal(photo)}>
              <img src={`${SERVER_URL}/uploads/${photo.filename}`} alt={`gallery-${idx}`} />
            </PhotoItem>
          ))
        ) : (
          <NoPhotos>No photos uploaded yet.</NoPhotos>
        )}
      </PhotoGrid>

      {modalImg && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseBtn onClick={closeModal}>✕</CloseBtn>
            <ModalImage src={modalImg} alt="Full View" />
            <TrashBtn onClick={handleDelete} title="Delete photo">
             
            </TrashBtn>
          </ModalContent>
        </ModalOverlay>
      )}
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
  cursor: pointer;
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  &:hover img {
    transform: scale(1.05);
  }
`;

const NoPhotos = styled.p`
  color: #777;
  font-style: italic;
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
`;

const ModalImage = styled.img`
  width: auto;
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #444;
  cursor: pointer;
`;

const TrashBtn = styled.button`
  position: absolute;
  bottom: 8px;
  left: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: red;
  cursor: pointer;
`;
