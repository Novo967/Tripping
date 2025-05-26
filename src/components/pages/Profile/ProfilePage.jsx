import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import UploadProfilePic from './ProfileServices/UploadProfilePic';
import UploadForm from './ProfileServices/UploadForm';
import Gallery from './ProfileServices/Gallery';
import { Button } from '../../Service/Button';

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
          Already have an acount? <a onClick={() => navigate('/login')}>Sign in</a>
        </BottomLink>
      </Message>
    );
  }

  if (!profile) return <Loading>טוען פרופיל...</Loading>;

  return (
    <Page>
      <Container>
        <BackButton onClick={() => navigate(-1)}>← חזור</BackButton>

        <Header>
          <PictureWrapper>
            <ProfilePic src={`${SERVER_URL}/uploads/${profile.profile_pic||'profile_defult_img.webp'}`} alt="Profile" />
            <StyledUpload>
              <UploadProfilePic
                onUploadSuccess={(newFilename) =>
                  setProfile((prev) => ({ ...prev, profile_pic: newFilename }))
                }
              />
            </StyledUpload>
          </PictureWrapper>

          <UserInfo>
            <Name>{profile.name}</Name>
            {profile.location && <Location>📍 {profile.location}</Location>}
            {profile.bio && <Bio>{profile.bio}</Bio>}
          </UserInfo>
        </Header>


        <Gallery
          photos={profile.photos || []}
          email={profile.email}
          onUploadSuccess={(newPhoto) =>
            setProfile((prev) => ({ ...prev, photos: [...(prev.photos || []), newPhoto] }))
          }
          onDeletePhoto={(filename) =>
            setProfile(prev => ({
              ...prev,
              photos: prev.photos.filter(p => p.filename !== filename)}))
          }
        />
      </Container>
    </Page>
  );
}

export default Profile;

// styled-components
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #f7f8fc, #e8ecf3);
  padding-top: 80px;
  padding-bottom: 40px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #2980b9;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding-left: 0.2rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
  gap: 1rem;
`;

const PictureWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
`;

const ProfilePic = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledUpload = styled.div`
  position: absolute;
  bottom: 5px;  /* Move up by half the button's height */
  right: 5px;   /* Move left by half the button's width */
  z-index: 2;     /* Above the profile image */
`;

const UserInfo = styled.div`
  
  background-color: none;
  border-radius: 16px;
  max-width: 90%;
`;

const Name = styled.h2`
  font-size: 2rem;
  margin-top: 0.1rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const Location = styled.p`
  font-size: 1rem;
  color: #666;
  margin-top: 0.3rem;
`;

const Bio = styled.p`
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #444;
  max-width: 600px;
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
