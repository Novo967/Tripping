import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './ProfileServices/ProfileHeader';
import Gallery from './ProfileServices/Gallery';
import { Button } from '../../Service/Button';
import UploadForm from './ProfileServices/UploadForm';
import UploadProfilePic from './ProfileServices/UploadProfilePic';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await axios.get(`${SERVER_URL}/profile?email=${email}`);
        setProfile(response.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error loading profile:", error);
        setIsLoggedIn(false);
      }
    };

    fetchProfile();
  }, []);

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

  if (!profile) return <Loading>טוען פרופיל...</Loading>;

  return (
    <Container>
      <Cover />
      <ProfileSection>
        <ProfileImage>
          <img
            src={`${SERVER_URL}/uploads/${profile.profile_pic}`}
            alt="Profile"
          />
        </ProfileImage>
        <h2>{profile.name}</h2>
        <StyledFollowersInfo>
          <div>
            <span className="count">{profile.followers}</span>
            <span className="label">Followers</span>
          </div>
          <div>
            <span className="count">{profile.following}</span>
            <span className="label">Following</span>
          </div>
        </StyledFollowersInfo>
      </ProfileSection>

      <UploadProfilePic
        onUploadSuccess={(newFilename) =>
          setProfile((prev) => ({
            ...prev,
            profile_pic: newFilename,
          }))
        }
      />

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
        photos={profile.photos || []}
        email={profile.email}
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
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(to bottom right, #ecf7fa, #f3fcff);
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
`;

const Cover = styled.div`
  height: 180px;
  background: linear-gradient(to right, #6dd5ed, #2193b0);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  margin-top: -70px;

  h2 {
    font-size: 2rem;
    color: #222;
    margin-top: 0.5rem;
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border: 5px solid white;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
  box-shadow: 0 0 0 4px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StyledFollowersInfo = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  background: #f0fbff;
  padding: 1rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);

  div {
    text-align: center;
  }

  .count {
    display: block;
    font-size: 1.4rem;
    font-weight: bold;
    color: #0077b6;
  }

  .label {
    font-size: 0.9rem;
    color: #555;
  }
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.5rem;
  padding: 2rem;
  color: #555;
`;

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
