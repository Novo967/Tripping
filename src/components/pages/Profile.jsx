import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileHeader from '../Profile/ProfileHeader';
import FollowersInfo from '../Profile/FollowersInfo';
import UploadPhoto from '../Profile/UploadPhoto';
import Gallery from '../Profile/Gallery';
import UploadForm from '../Profile/UploadForm';
import UploadProfilePic from '../Profile/UploadProfilePic';
import styled from 'styled-components';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error("Email not found in localStorage");
        return;
      }
      try {
        const response = await axios.get(`https://reactwebsite-2.onrender.com/profile?email=${email}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <Loading>Profile loading...</Loading>;

  return (
    <Container>
      {profile?.profile_pic && (
        <ProfilePicture>
          <img
            src={`https://reactwebsite-2.onrender.com/uploads/${profile.profile_pic}`}
            alt="Profile"
          />
        </ProfilePicture>
      )}

      <ProfileHeader name={profile.name} />

      <UploadProfilePic
        onUploadSuccess={(newFilename) =>
          setProfile((prev) => ({
            ...prev,
            profile_pic: newFilename,
          }))
        }
      />

      <FollowersInfo followers={profile.followers} following={profile.following} />
      <UploadPhoto />

      <UploadForm
        email={profile.email}
        onUploadSuccess={(newPhoto) =>
          setProfile((prev) => ({
            ...prev,
            photos: [...(prev.photos || []), newPhoto],
          }))
        }
      />

      <Gallery
        photos={profile?.photos || []}
        email={profile?.email}
        onUploadSuccess={(newPhoto) =>
          setProfile((prev) => ({
            ...prev,
            photos: [...(prev.photos || []), newPhoto],
          }))
        }
      />
    </Container>
  );
}

export default Profile;

// styled-components
const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  text-align: center;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.5rem;
  padding: 2rem;
`;

const ProfilePicture = styled.div`
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #3498db;
    object-fit: cover;
  }
`;
