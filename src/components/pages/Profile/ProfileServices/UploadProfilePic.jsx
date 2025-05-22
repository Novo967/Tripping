import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const UploadProfilePic = ({ onUploadSuccess }) => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage('');
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('email', localStorage.getItem('userEmail'));

    try {
      setUploading(true);
      const res = await axios.post(`${SERVER_URL}/upload_profile_pic`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess(res.data.filename);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed. Please try again.');
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
      <CircleButton
        onClick={() => {
          if (!uploading) {
            setMessage('');
            fileInputRef.current.click();
          }
        }}
        disabled={uploading}
        title="Edit Profile Picture"
      >
        <FontAwesomeIcon icon={faPen} size="1px" />
      </CircleButton>
      {message && <Message>{message}</Message>}
    </Form>
  );
};

export default UploadProfilePic;

// styled-components
const Form = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const CircleButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
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

const Message = styled.p`
  font-size: 0.9rem;
  color: #333;
  margin: 0;
`;
