import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // prevent default form submission
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('email', localStorage.getItem('userEmail'));

    try {
      setUploading(true);
      const res = await axios.post('https://reactwebsite-2.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Upload successful!');
      setFile(null);
      onUploadSuccess(res.data.photo);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <StyledForm onSubmit={handleUpload}>
      <Controls>
        <HiddenInput
          ref={fileInputRef}
          id="fileInput"
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <UploadButton
          type="button"
          onClick={() => fileInputRef.current.click()}
        >
          Choose File
        </UploadButton>
        <UploadButton type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </UploadButton>
      </Controls>
      {message && <Message>{message}</Message>}
    </StyledForm>
  );
};

export default UploadForm;

// styled-components
const StyledForm = styled.form`
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

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
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
  margin-top: 10px;
  font-size: 0.95rem;
  color: #333;
`;
