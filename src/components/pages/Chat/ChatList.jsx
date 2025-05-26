import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChatModal from '../Chat/ChatModal';
import { db } from '../../firebase'; // וודא שזה הנתיב לקובץ firebase.js שלך
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!currentUserId) return;

    const fetchChats = async () => {
      try {
        const q = query(collection(db, 'chats'), where('userIds', 'array-contains', currentUserId));
        const querySnapshot = await getDocs(q);

        const chatData = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const chat = docSnap.data();
          const otherUserId = chat.userIds.find(id => id !== currentUserId);
          const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
          const otherUser = otherUserDoc.exists() ? otherUserDoc.data() : {};

          return {
            chatId: docSnap.id,
            otherId: otherUserId,
            otherUsername: otherUser.username || 'Unknown',
            otherEmail: otherUser.email || '',
            otherProfilePic: otherUser.profilePic || '', // URL מלא לתמונה
          };
        }));

        setChats(chatData);
      } catch (error) {
        console.error('Error fetching chats from Firestore:', error);
      }
    };

    fetchChats();
  }, [currentUserId]);

  const handleOpenChat = (chat) => {
    setSelectedChat(chat);
    setModalOpen(true);
  };

  return (
    <Wrapper>
      <h2>השיחות שלי</h2>
      {chats.map(chat => (
        <ChatBanner key={chat.chatId} onClick={() => handleOpenChat(chat)}>
          <img src={chat.otherProfilePic} alt="Profile" />
          <span>{chat.otherUsername}</span>
        </ChatBanner>
      ))}

      {selectedChat && (
        <ChatModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={currentUserId}
          otherId={selectedChat.otherId}
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
