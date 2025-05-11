import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '../Button';
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
  const radius = 20; // גודל העיגול

  const iconHtml = `
    <div style="
      width: ${radius * 2}px; 
      height: ${radius * 2}px; 
      background-color: ${photoUrl ? 'transparent' : '#3498db'}; 
      border-radius: 50%; 
      position: relative; 
      overflow: hidden;">
      
      <!-- התמונה הממוקמת במרכז (עיגול) -->
      ${photoUrl ? `<img src="${photoUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />` : ''}
     </div> `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-profile-icon',
    iconSize: [radius * 2, radius * 2 + 10], // גודל האייקון הכולל (עיגול + קצה מחודד)
    iconAnchor: [radius, radius * 2], // נקודת העיגול שתואמת למיקום של המארקר
    popupAnchor: [0, -radius * 2 - 10] // הצמדת פופאפ מתחת למארקר
  });
};






const MapContainer = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async (latitude, longitude) => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        try {
          const response = await axios.get(`${SERVER_URL}/profile?email=${email}`);
          setUserProfilePic(response.data.profile_pic);

          await axios.post(`${SERVER_URL}/api/update_location`, {
            email,
            latitude,
            longitude
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true  // רק אם השרת דורש cookies/session
          });
        } catch (error) {
          console.error('Error fetching profile picture:', error);
          setIsLoggedIn(false);
        }
      }
      else {
        setIsLoggedIn(false);
      }
    };
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          console.log(position.coords);
          // ✅ Call a separate async function!
          fetchUserProfile(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported.');
    }
  }, []);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/locations`);
        setAllUsers(res.data);
        

      } catch (err) {
        console.error('Error fetching all user locations:', err);
      }
    };
  
    fetchAllUsers();
  }, []);
  if (!userLocation) {
    return <div className="map-placeholder">Loading your location...</div>;
  }
if (!isLoggedIn) {
    return (
      <Message>
        <video src="/videos/video-5.mp4" autoPlay loop muted />
        <Overlay />
        <BottomGradient />
        <h2>It seems we don't know each other yet</h2>
        <p>Let's create your profile</p>
        <Button className='btns' to='/sign-up' buttonStyle='btn--outline' buttonSize='btn--large'>
          Register
        </Button>
        <BottomLink>
          Already have an account? <a onClick={() => navigate('/login')}>Log in</a>
        </BottomLink>
      </Message>
    );
  }
  return (
    <div className="map-placeholder">
      <ServiceContainer>
        <LeafletMap 
          center={[userLocation.latitude, userLocation.longitude]} 
          zoom={13} 
          style={{ height: "60vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createProfileIcon(
                  userProfilePic ? `${SERVER_URL}/uploads/${userProfilePic}` : null
              )}
              >
              <Popup>
                  You are here!
              </Popup>
          </Marker>
          {allUsers.filter(user => user.is_online).map((user) => (
            <Marker
              key={user.id}
              position={[user.lat, user.lng]}
              icon={createProfileIcon(user.profile_image ? `${SERVER_URL}/uploads/${user.profile_image}` : null)}
            >
              <Popup>
                {user.username}
              </Popup>
            </Marker>
          ))}
      </LeafletMap>
      </ServiceContainer>
    </div>
  );
};

export default MapContainer;