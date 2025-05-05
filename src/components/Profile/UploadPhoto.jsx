import React from 'react';
import { Button } from '../Button';

function UploadPhoto() {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      // Add upload logic here
    }
  };

  return (
    <div className="upload-photo">
      
      <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleUpload} />
      
    </div>
  );
}

export default UploadPhoto;
