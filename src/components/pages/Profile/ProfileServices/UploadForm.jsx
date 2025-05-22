import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const UploadForm = ({ onUploadSuccess }) => {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('email', localStorage.getItem('userEmail'));

    try {
      setUploading(true);
      const res = await axios.post(`${SERVER_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess(res.data.photo);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <ButtonCircle
        onClick={() => {
          if (!uploading) {
            fileInputRef.current.click();
          }
        }}
        disabled={uploading}
        title={uploading ? 'Uploading...' : 'Upload Photo'}
      >
        <FontAwesomeIcon icon={faPlus} />
      </ButtonCircle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Form>
  );
};

export default UploadForm;

// styled-components
const Form = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  padding: 12px;
  border: 2px dashed #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  justify-content: center;
  flex-direction: column;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonCircle = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  font-size: 14px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #2980b9;
  }
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 10px;
  font-size: 0.95rem;
  color: red;
`;
