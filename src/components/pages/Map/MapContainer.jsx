import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../../Service/Button.jsx';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Message = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  overflow: hidden;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
  }

  h2 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #fff;
    z-index: 2;
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    color: #eee;
    z-index: 2;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: -1;
`;

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 40%;
  width: 100%;
  background: linear-gradient(to top, rgba(217, 192, 188, 0.6), transparent);
  z-index: -1;
`;

const BottomLink = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #ddd;
  z-index: 2;

  a {
    color: #4ab1d8;
    text-decoration: none;
    cursor: pointer;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ServiceContainer = styled.div`
  margin-top: 75px;
  padding: 10px;
  text-align: center;
`;

const createProfileIcon = (photoUrl) => {
  const radius = 20;
  const iconHtml = `
    <div style="
      width: ${radius * 2}px; 
      height: ${radius * 2}px; 
      background-color: ${photoUrl ? 'transparent' : '#3498db'}; 
      border-radius: 50%; 
      position: relative; 
      overflow: hidden;">
      ${photoUrl ? `<img src="${photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />` : ''}
    </div>`;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-profile-icon',
    iconSize: [radius * 2, radius * 2 + 10],
    iconAnchor: [radius, radius * 2],
    popupAnchor: [0, -radius * 2 - 10]
  });
};

// מאזין ללחיצות במפה ומשגר את handleMapClick
const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e);
    }
  });
  return null;
};

const MapContainer = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showAddPin, setShowAddPin] = useState(false); // מצב נעיצת סיכה
  const [pins, setPins] = useState([]);                // רשימת סיכות עם הודעות

  const navigate = useNavigate();

  // Toggle מצב נעיצה
  const toggleAddPin = () => {
    setShowAddPin(prev => !prev);
  };

  // Handler ללחיצת מפה
  const handleMapClick = async (e) => {
  if (!showAddPin) return;
  const { lat, lng } = e.latlng;
  const message = prompt('מה ברצונך לשתף כאן?');

  if (message && message.trim() !== '') {
    const email = localStorage.getItem('userEmail');
    try {
      // שליחת סיכה לשרת
      await axios.post(`${SERVER_URL}/api/pins`, {
        lat,
        lng,
        message,
        email
      });

      // עדכון הסיכות המקומיות מחדש מהשרת
      fetchPins();
    } catch (err) {
      console.error('שגיאה בשליחת סיכה לשרת:', err);
    }

    setShowAddPin(false);
  }
};


  // Fetch existing pins
  const fetchPins = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/pins`);
      setPins(res.data);
    } catch (err) {
      console.error('Error fetching pins:', err);
    }
  };

  useEffect(() => {
    // First load user location & profile
    const fetchUserProfile = async (latitude, longitude) => {
      const email = localStorage.getItem('userEmail');
      if (!email) return setIsLoggedIn(false);
      try {
        const response = await axios.get(`${SERVER_URL}/profile?email=${email}`);
        setUserProfilePic(response.data.profile_pic);
        await axios.post(
          `${SERVER_URL}/api/update_location`,
          { email, latitude, longitude },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
      } catch {
        setIsLoggedIn(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });
          fetchUserProfile(latitude, longitude);
        },
        console.error
      );
    }
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/locations`);
        setAllUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllUsers();
    fetchPins();
  }, []);

  if (!userLocation) return <div className="map-placeholder">Loading your location...</div>;
  if (!isLoggedIn) return <Message>...please login</Message>;

  return (
    <div className={`map-placeholder ${showAddPin ? 'pin-mode' : ''}`}>  
      <ServiceContainer>
        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleAddPin}
            style={{
              position: 'absolute', top: 10, right: 10, padding: '10px 16px',
              fontSize: '16px', backgroundColor: showAddPin ? '#ff6b6b' : '#4caf50',
              color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', zIndex: 1000
            }}
          >
            {showAddPin ? '❌ בטל נעיצה' : '📍 נעץ סיכה'}
          </button>

          <LeafletMap
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={13}
            style={{ height: '60vh', width: '100%' }}
          >
            {/* מאזינים ללחיצות מפה */}
            <MapClickHandler onClick={handleMapClick} />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* מארקרים */}
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createProfileIcon(userProfilePic ? `${SERVER_URL}/uploads/${userProfilePic}` : null)}
            >
              <Popup>You are here!</Popup>
            </Marker>

            {allUsers.map(user => (
              <Marker
                key={user.id}
                position={[user.lat, user.lng]}
                icon={createProfileIcon(user.profile_image ? `${SERVER_URL}/uploads/${user.profile_image}` : null)}
              >
                <Popup>
                  <div onClick={() => navigate(`/visitor/${encodeURIComponent(user.email)}`)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    {user.username}
                  </div>
                </Popup>
              </Marker>
            ))}

            
            {/* הסיכות עם כפתור מחיקה ליוצר בלבד */}
            {pins.map(pin => (
              <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                <Popup>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{pin.message}</span>
                    {pin.email === localStorage.getItem('userEmail') && (
                      <button
                        style={{ marginTop: '8px', color: 'red', cursor: 'pointer' }}
                        onClick={async () => {
                          try {
                            await axios.delete(
                              `${SERVER_URL}/api/pins/${pin.id}`,
                              { params: { email: localStorage.getItem('userEmail') } }
                            );
                            fetchPins();  // רענון הסיכות אחרי המחיקה
                          } catch (err) {
                            console.error('Error deleting pin:', err);
                          }
                        }}
                      >
                        🗑️ מחק סיכה
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

          </LeafletMap>
        </div>
      </ServiceContainer>
    </div>
  );
};

export default MapContainer;
