import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../Service/Button'; // ודא שהנתיב נכון בהתאם למיקום שלך

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const VisitorProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [modalImg, setModalImg] = useState(null);

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

  const openModal = (img) => setModalImg(img);
  const closeModal = () => setModalImg(null);

  if (!userData) {
    return <div style={styles.loading}>Loading profile</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Return</button>

        <div style={styles.header}>
          <img
            src={`${SERVER_URL}/uploads/${userData.profile_pic}`}
            alt="Profile"
            style={styles.profilePic}
          />
        <div style={styles.userInfo}>
          <h2 style={styles.name}>{userData.name}</h2>
          {userData.location && <p style={styles.location}>📍 {userData.location}</p>}
          {userData.bio && <p style={styles.bio}>{userData.bio}</p>}
      </div>
      <div style={styles.buttonWrapper}>
          <Button
            to={`/chat/${userData.email}`}
            buttonStyle="btn--primary"
            buttonSize="btn--medium"
          >Send Message
          </Button>
        </div>
    </div>
        <div style={styles.gallerySection}>
          <h3 style={styles.galleryTitle}>Gallery</h3>
          <div style={styles.gallery}>
            {userData.gallery.map((img, index) => (
              <img
                key={index}
                src={`${SERVER_URL}/uploads/${img}`}
                alt={`gallery-${index}`}
                style={styles.galleryImg}
                onClick={() => openModal(`${SERVER_URL}/uploads/${img}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {modalImg && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            <img src={modalImg} alt="Full View" style={styles.modalImage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorProfile;

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #f7f8fc, #e8ecf3)',
    paddingTop: '80px',
    paddingBottom: '40px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '1.4rem',
    color: '#555',
    background: 'linear-gradient(to right, #f7f8fc, #e8ecf3)',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#2c3e50',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#2980b9',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '1rem',
    paddingLeft: '0.2rem',
  },

  // פרטי פרופיל עליון
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    textAlign: 'center',
    gap: '1rem',
  },
  profilePic: {
    width: '140px',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  userInfo: {
    marginTop: '1rem',
    backgroundColor: '#ffffffdd',
    padding: '1rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    maxWidth: '90%',
  },
  name: {
    fontSize: '2.2rem',
    marginTop: '1rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  location: {
    fontSize: '1rem',
    color: '#666',
    marginTop: '0.3rem',
  },
  bio: {
    fontSize: '1rem',
    marginTop: '0.5rem',
    color: '#444',
    maxWidth: '600px',
  },
  buttonWrapper: {
     marginTop: '1.2rem', 
    background: 'none', // הסרת רקע
    padding: 0, // הסרת ריפוד מיותר
    display: 'inline-block',
  },

  // גלריה
  gallerySection: {
    marginTop: '2.5rem',
  },
  galleryTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.2rem',
    fontWeight: '600',
    color: '#34495e',
    borderBottom: '2px solid #ccc',
    paddingBottom: '0.5rem',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '1rem',
  },
  galleryImg: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '10px',
    transition: 'transform 0.3s ease',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
  },

  // מודל
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '80vh',
    borderRadius: '8px',
  },
  closeBtn: {
    position: 'absolute',
    top: '8px',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#444',
    cursor: 'pointer',
  },
};
