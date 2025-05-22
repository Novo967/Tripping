import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ChatModal({ isOpen, onClose, userEmail, otherId }) {
  const [chatId, setChatId]     = useState(null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText]   = useState('');
  const bottomRef = useRef();

  const fetchMessages = () => {
    axios.get(`${SERVER_URL}/api/chats/with/${otherId}`, {
      params: { email: userEmail }
    })
    .then(res => {
      setChatId(res.data.chat_id);
      setMessages(res.data.messages);
    })
    .catch(console.error);
  };

  // שליפת ההיסטוריה כשפותחים
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  // גלילה אוטומטית למטה
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
      fetchMessages();   // <— כאן נשאוב שוב את כל ההודעות
    })
    .catch(console.error);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Chat</Title>
          <Close onClick={onClose}>✕</Close>
        </Header>
        <Messages>
          {messages.map(msg => {
            const isMine = msg.sender_email === userEmail;
            return (
              <MsgBubble key={msg.id} isMine={isMine}>
                {msg.text}
                <Timestamp>{new Date(msg.timestamp).toLocaleTimeString()}</Timestamp>
              </MsgBubble>
            );
          })}
          <div ref={bottomRef} />
        </Messages>
        <InputRow>
          <Input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <Send onClick={sendMessage}>Send</Send>
        </InputRow>
      </Modal>
    </Overlay>
  );
}

// Styled-components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 90%;
  max-width: 400px;
  max-height: 80%;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f1f1f1;
`;

const Title = styled.h4`
  margin: 0;
`;

const Close = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Messages = styled.div`
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  background: #fafafa;
`;

const MsgBubble = styled.div`
  align-self: ${props => (props.isMine ? 'flex-start' : 'flex-start')};
  background: ${props => (props.isMine ? '#add8e6' : '#fff')};
  text: ${props => (props.isMine ? 'right' : '#left')};
  padding: 8px;
  margin: 4px 0;
  border-radius: 8px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  max-width: 80%;
`;

const Timestamp = styled.span`
  display: block;
  font-size: 0.7rem;
  color: #888;
  margin-top: 4px;
`;

const InputRow = styled.div`
  display: flex;
  padding: 8px;
  background: #eee;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 0.9rem;
`;

const Send = styled.button`
  padding: 8px 12px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;



