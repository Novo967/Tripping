import React, { useEffect, useState } from 'react';
import ChatModal from '../Chat/ChatModal';
import styled from 'styled-components';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;


import {
  getFirestore, collection, query, where, onSnapshot, getDoc, doc
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3WJO0D6ie6dOl2Ska4v9NhhCiVQip4WU",
  authDomain: "trippingchat.firebaseapp.com",
  projectId: "trippingchat",
  storageBucket: "trippingchat.firebasestorage.app",
  messagingSenderId: "688894548206",
  appId: "1:688894548206:web:9d2599c7924807b66ebbff"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) return;

    const q = query(collection(db, 'chats'), where('participants', 'array-contains', userEmail));

    const unsubscribe = onSnapshot(q, async snapshot => {
      const chatData = await Promise.all(snapshot.docs.map(async docSnap => {
        const data = docSnap.data();
        const otherEmail = data.participants.find(p => p !== userEmail);

        // משיכת מידע נוסף על המשתמש השני
        let otherUsername = otherEmail;
        let otherProfilePic = '';

        try {
          const userDoc = await getDoc(doc(db, 'users', otherEmail));
          if (userDoc.exists()) {
            const userInfo = userDoc.data();
            otherUsername = userInfo.username || otherEmail;
            otherProfilePic = userInfo.profilePic || '';
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }

        return {
          chatId: docSnap.id,
          lastMessage: data.lastMessage,
          otherEmail,
          otherUsername,
          otherProfilePic,
        };
      }));

      setChats(chatData);
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
      {chats.map(chat => (
        <ChatBanner key={chat.chatId} onClick={() => handleOpenChat(chat)}>
          {chat.otherProfilePic ? (
           <img
            src={`${SERVER_URL}/uploads/${chat.otherProfilePic}`}
            alt="Profile"
            />

          ) : (
            <PlaceholderPic />
          )}
          <span>{chat.otherUsername}</span>
        </ChatBanner>
      ))}

      {selectedChat && (
        <ChatModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userEmail={userEmail}
          otherEmail={selectedChat.otherEmail}
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

const PlaceholderPic = styled.div`
  width: 50px;
  height: 50px;
  background: #ccc;
  border-radius: 50%;
`;
