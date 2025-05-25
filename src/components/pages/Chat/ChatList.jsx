import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatModal from '../Chat/ChatModal';
import styled from 'styled-components';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) return;

    axios.get(`${SERVER_URL}/user_chats`, { params: { userEmail } })
      .then(res => {
        setChats(res.data);
      })
      .catch(console.error);
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
          <img src={`${SERVER_URL}/uploads/${chat.otherProfilePic}`} alt="Profile" />
          <span>{chat.otherUsername}</span>
        </ChatBanner>
      ))}

      {selectedChat && (
        <ChatModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userEmail={userEmail}
          otherEmail={selectedChat.otherEmail}
          otherId={selectedChat.otherId}
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
