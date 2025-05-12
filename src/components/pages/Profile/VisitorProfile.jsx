// src/pages/VisitorProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const VisitorProfile = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/visitor_profile?email=${email}`);
        setUserData(res.data);
      } catch (err) {
        console.error('Error fetching visitor profile:', err);
      }
    };

    fetchVisitorData();
  }, [email]);

  if (!userData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{userData.name}</h2>
      <img
        src={`${SERVER_URL}/uploads/${userData.profile_pic}`}
        alt="Profile"
        style={{ width: '150px', borderRadius: '50%' }}
      />
      <h3>Gallery</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {userData.gallery.map((img, index) => (
          <img
            key={index}
            src={`${SERVER_URL}/uploads/${img}`}
            alt="gallery item"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
};

export default VisitorProfile;
