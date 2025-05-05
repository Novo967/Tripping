import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const UploadProfilePic = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('email', localStorage.getItem('userEmail'));

    try {
      setUploading(true);
      const res = await axios.post('https://reactwebsite-2.onrender.com/upload_profile_pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      onUploadSuccess(res.data.filename);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form onSubmit={handleUpload}>
      <Controls>
        <HiddenInput
          ref={fileInputRef}
          id="fileInput"
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <SmallButton type="button" onClick={() => fileInputRef.current.click()}>
          Choose File
        </SmallButton>
        <SmallButton type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </SmallButton>
      </Controls>
      {message && <Message>{message}</Message>}
    </Form>
  );
};

export default UploadProfilePic;

// styled-components
const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  padding: 12px;
  background-color: #f9f9f9;
  justify-content: center;
  flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const SmallButton = styled.button`
  padding: 3px 6px;
  border-radius: 5px;
  font-size: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
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
  margin-top: 8px;
`;
