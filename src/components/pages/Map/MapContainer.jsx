import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../../Service/Button.jsx';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PinForm from './PinForm.jsx';

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
  const [userProfilePic] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [pins, setPins] = useState([]);
  const [pinMode, setPinMode] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [clickLocation, setClickLocation] = useState(null);

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const fetchPins = async () => {
    try { const res = await axios.get(`${SERVER_URL}/api/pins`); setPins(res.data); }
    catch (err) { console.error('Error fetching pins:', err); }
  };

  const fetchAllUsers = async () => {
    try { const res = await axios.get(`${SERVER_URL}/api/locations`); setAllUsers(res.data); }
    catch (err) { console.error('Error fetching users:', err); }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchPins();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setUserLocation({ latitude, longitude });
          const email = userEmail;
          if (email) {
            axios.post(`${SERVER_URL}/api/update_location`, { email, latitude, longitude }, { withCredentials: true });
          } else setIsLoggedIn(false);
        },
        console.error
      );
    }
  }, []);

  const togglePinMode = () => {
    const count = pins.filter(p => p.email === userEmail).length;
    if (!pinMode && count >= 3) { alert('לא ניתן לדקור יותר מ־3 סיכות'); return; }
    setPinMode(prev => !prev);
    if (pinMode) setFormVisible(false);
  };

  const handleMapClick = (e) => {
    if (!pinMode) return;
    setClickLocation(e.latlng);
    setFormVisible(true);
    setPinMode(false);
  };

  if (!userLocation) return <div>Loading your location...</div>;
  if (!isLoggedIn) return <Message>...please login</Message>;

  return (
    <div className={`map-placeholder ${pinMode ? 'pin-mode' : ''}`}>  
      <ServiceContainer>
        <div style={{ position: 'relative' }}>
          <button onClick={togglePinMode} style={{ position:'absolute', top:10, right:10, zIndex:1000, padding:'12px', backgroundColor: pinMode ? '#ff6b6b' : '#4caf50', color:'#fff', border:'none', borderRadius:'8px' }}>
            {pinMode ? '❌' : '📍'}
          </button>

          <LeafletMap center={[userLocation.latitude, userLocation.longitude]} zoom={13} style={{ height:'60vh', width:'100%' }}>
            <MapClickHandler onClick={handleMapClick} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

            {/* מארקר המשתמש */}
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={createProfileIcon(userProfilePic ? `${SERVER_URL}/uploads/${userProfilePic}` : null)}>
              <Popup>You are here!</Popup>
            </Marker>

            {/* מארקרי משתמשים אחרים */}
            {allUsers.map(u => (
              <Marker key={u.id} position={[u.lat, u.lng]} icon={createProfileIcon(u.profile_image ? `${SERVER_URL}/uploads/${u.profile_image}` : null)}>
                <Popup><span onClick={() => navigate(`/visitor/${encodeURIComponent(u.email)}`)} style={{cursor:'pointer'}}>{u.username}</span></Popup>
              </Marker>
            ))}

            {/* מארקרי סיכות עם פרטים מורחבים ושם משתמש */}
            {pins.map(pin => {
              return (
                <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                  <Popup>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong> {pin.type}</strong>
                      <span>תאריך: {new Date(pin.date).toLocaleDateString('he-IL')}</span>
                      <p>{pin.message}</p>
                      <em
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate(`/visitor/${encodeURIComponent(pin.email)}`)}
                      >
                        על ידי: {pin.username}
                      </em>
                      {pin.email === userEmail && (
                        <button onClick={async () => { await axios.delete(`${SERVER_URL}/api/pins/${pin.id}`, { params: { email: userEmail } }); fetchPins(); }} style={{ marginTop: '8px', color: 'red', cursor: 'pointer' }}>🗑️ מחק</button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </LeafletMap>

          {/* טופס לאחר בחירת מיקום */}
          <PinForm
            visible={formVisible && clickLocation}
            onCancel={() => setFormVisible(false)}
            onSave={({ type, date, message }) => {
              axios.post(`${SERVER_URL}/api/pins`, { lat: clickLocation.lat, lng: clickLocation.lng, type, date, message, email: userEmail }).then(() => { fetchPins(); setFormVisible(false); });
            }}
          />
        </div>
      </ServiceContainer>
    </div>
  );
};

export default MapContainer;


