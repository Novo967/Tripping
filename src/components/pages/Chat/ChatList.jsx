import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase'; // או הנתיב הנכון
import axios from 'axios';
import styled from 'styled-components';
import ChatModal from '../Chat/ChatModal';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // מפה של אימייל -> { username, profilePic }
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const userEmail = localStorage.getItem('userEmail');

  // טען צ'אטים של המשתמש מ-Firebase
  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userEmail)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsData);

      // אסוף כל האימיילים של המשתמשים האחרים בצ'אטים
      const otherEmails = new Set();
      chatsData.forEach(chat => {
        chat.participants.forEach(email => {
          if (email !== userEmail) otherEmails.add(email);
        });
      });

      // טען פרטי משתמשים מהשרת Flask לפי האימיילים
      Promise.all(
        Array.from(otherEmails).map(email =>
          axios.get(`${SERVER_URL}/user_profile`, { params: { email } })
            .then(res => ({ email, data: res.data }))
            .catch(() => null)
        )
      ).then(results => {
        const map = {};
        results.forEach(r => {
          if (r) {
            map[r.email] = r.data; // צריך לקבל { username, profilePic } מהשרת
          }
        });
        setUsersMap(map);
      });
    });

    return () => unsubscribe();
  }, [userEmail]);

  const handleOpenChat = (chat) => {
    setSelectedChat(chat);
    setModalOpen(true);
  };

  return (
    <Wrapper>
      <h2>My Chats</h2>
      {chats.map(chat => {
        // מי המשתמש השני בצ'אט?
        const otherEmail = chat.participants.find(email => email !== userEmail);
        const userInfo = usersMap[otherEmail] || {};
        const profilePicUrl = userInfo.profilePic
          ? `${SERVER_URL}/uploads/${userInfo.profilePic}`
          :  `${SERVER_URL}/uploads/profile_defult_img.webp`; // תמונת ברירת מחדל

        return (
          <ChatBanner key={chat.id} onClick={() => handleOpenChat(chat)}>
            <img src={profilePicUrl} alt="Profile" />
            <span>{userInfo.username || otherEmail}</span>
          </ChatBanner>
        );
      })}

      {selectedChat && (
        <ChatModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userEmail={userEmail}
          otherEmail={selectedChat.participants.find(email => email !== userEmail)}
          chatId={selectedChat.id}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: auto;
`;

const ChatBanner = styled.div`
  background: #f0f0f0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-size: 1.1rem;
    font-weight: bold;
  }

  &:hover {
    background: #e0e0e0;
  }
`;
