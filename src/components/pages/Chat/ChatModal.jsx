import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ChatModal({ isOpen, onClose, userEmail, otherId }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef();
  const typingTimeout = useRef(null);

  const fetchMessages = () => {
    axios.get(`${SERVER_URL}/api/chats/with/${otherId}`, {
      params: { email: userEmail }
    })
    .then(res => {
      setChatId(res.data.chat_id);
      setMessages(res.data.messages);
      setOtherUser(res.data.other_user); // expects {name, image}
    })
    .catch(console.error);
  };

  useEffect(() => {
    if (isOpen) fetchMessages();
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newText.trim() || !chatId) return;
    axios.post(`${SERVER_URL}/api/chats/${chatId}/messages`, {
      email: userEmail,
      text: newText
    })
    .then(() => {
      setNewText('');
      setIsTyping(false);
      fetchMessages();
    })
    .catch(console.error);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e) => {
    setNewText(e.target.value);
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Profile>
            {otherUser?.image && <Avatar src={otherUser.image} alt="avatar" />}
            <NameContainer>
              <Name>{otherUser?.name || 'User'}</Name>
              {isTyping && <Typing>{otherUser?.name || 'User'} is typing...</Typing>}
            </NameContainer>
          </Profile>
          <Close onClick={onClose}>✕</Close>
        </Header>
        <Messages>
          {messages.map(msg => {
            const isMine = msg.sender_email === userEmail;
            return (
              <MsgBubble key={msg.id} isMine={isMine}>
                {msg.text}
                <Timestamp isMine={isMine}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Timestamp>
              </MsgBubble>
            );
          })}
          <div ref={bottomRef} />
        </Messages>
        <InputRow>
          <Input
            value={newText}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={2}
          />
          <Send onClick={sendMessage}>Send</Send>
        </InputRow>
      </Modal>
    </Overlay>
  );
}

// styled-components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  padding: 40px 30px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const Modal = styled.div`
  width: 85%;
  max-width: 480px;
  height: 90%;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    max-width: 100%;
    height: 80vh;
    border-radius: 12px;
    padding: 16px 20px;
  }
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: transparent;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 1rem;
  color: #000;
`;

const Typing = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const Close = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #f39c12;
  font-weight: bold;
  transition: color 0.2s ease;

  &:hover {
    color: #d87e04;
  }
`;

const Messages = styled.div`
  flex: 1;
  padding: 16px 8px 8px 8px;
  overflow-y: auto;
  background: #f9fafc;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-top: 12px;
  margin-bottom: 16px;
`;

const MsgBubble = styled.div`
  align-self: ${props => (props.isMine ? 'flex-end' : 'flex-start')};
  background: ${props => (props.isMine ? '#a3d5ff' : '#e1e5f2')};
  color: #222;
  padding: 12px 18px;
  margin: 6px 0;
  border-radius: 18px;
  border-bottom-${props => (props.isMine ? 'right' : 'left')}-radius: 6px;
  max-width: 75%;
  word-wrap: break-word;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  position: relative;
  transition: all 0.3s ease;
`;

const Timestamp = styled.span`
  font-size: 0.7rem;
  color: #555;
  position: absolute;
  bottom: -18px;
  right: ${props => (props.isMine ? '10px' : 'unset')};
  left: ${props => (!props.isMine ? '10px' : 'unset')};
`;

const InputRow = styled.div`
  display: flex;
  padding: 12px 0;
  background: transparent;
  gap: 12px;
  align-items: center;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 14px 16px;
  border: 1.8px solid #d1d5db;
  border-radius: 10px;
  resize: none;
  color: black;
  font-size: 1rem;
  line-height: 1.5;
  background: #fff;
  transition: border-color 0.25s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.3);
  }
`;

const Send = styled.button`
  padding: 12px 20px;
  background: #f39c12;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #d87e04;
  }

  &:disabled {
    background: #f0c674;
    cursor: not-allowed;
  }
`;