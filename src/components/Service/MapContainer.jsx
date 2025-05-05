import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import defaultProfilePic from '../Profile/ProfilrImage/undraw_businesswoman_8lrc.png'; // Put a default profile image
import axios from 'axios';

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
  useEffect(() => {
    const fetchUserProfile = async (latitude, longitude) => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        try {
          const response = await axios.get(`https://reactwebsite-2.onrender.com/profile?email=${email}`);
          setUserProfilePic(response.data.profile_pic);

          await axios.post(`https://reactwebsite-2.onrender.com/update_location`, {
            email,
            latitude,
            longitude
          });
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
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
        const res = await axios.get(`https://reactwebsite-2.onrender.com/locations`);
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

  return (
    <div className="map-placeholder">
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
                userProfilePic ? `https://reactwebsite-2.onrender.com/uploads/${userProfilePic}` : null
            )}
            >
            <Popup>
                You are here!
            </Popup>
        </Marker>
        {allUsers.map((user) => (
          <Marker
            key={user.id}
            position={[user.lat, user.lng]}
            icon={createProfileIcon(user.profile_image ? `https://reactwebsite-2.onrender.com/uploads/${user.profile_image}` : null)}
          >
            <Popup>
              {user.username}
            </Popup>
          </Marker>
        ))}
      </LeafletMap>
    </div>
  );
};

export default MapContainer;