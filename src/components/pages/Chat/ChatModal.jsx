import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import {
  getFirestore, collection, query, orderBy,
  onSnapshot, addDoc, serverTimestamp
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// --- Firebase config and init ---
// TODO: הכנס כאן את ה־firebaseConfig שלך (מקונסול Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyB3WJO0D6ie6dOl2Ska4v9NhhCiVQip4WU",
  authDomain: "trippingchat.firebaseapp.com",
  projectId: "trippingchat",
  storageBucket: "trippingchat.firebasestorage.app",
  messagingSenderId: "688894548206",
  appId: "1:688894548206:web:9d2599c7924807b66ebbff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- פונקציה ליצירת chatId ייחודי וממוין לפי שני המיילים ---
function createChatId(email1, email2) {
  return [email1, email2].sort().join('_');
}

export default function ChatModal({ isOpen, onClose, userEmail, otherEmail }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const bottomRef = useRef();

  // צור את chatId ממיילים ממויים
  useEffect(() => {
    if (userEmail && otherEmail) {
      const id = createChatId(userEmail, otherEmail);
      setChatId(id);
    }
  }, [userEmail, otherEmail]);

  // האזנה ל-Firestore להודעות בזמן אמת
  useEffect(() => {
    if (!chatId) return;

    console.log('Starting Firestore listener for chatId:', chatId);

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      console.log('Messages updated:', msgs);
    });

    return () => {
      console.log('Unsubscribing listener for chatId:', chatId);
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // שליחת הודעה חדשה ל-Firestore
  const sendMessage = async () => {
    if (!newText.trim() || !chatId) return;
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        sender_email: userEmail,
        text: newText.trim(),
        timestamp: serverTimestamp(),
      });
      setNewText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Name>{otherEmail}</Name>
          <Close onClick={onClose}>✕</Close>
        </Header>
        <Messages>
          {messages.map(msg => {
            const isMine = msg.sender_email === userEmail;
            return (
              <MsgBubble key={msg.id} isMine={isMine}>
                {msg.text}
                <Timestamp isMine={isMine}>
                  {msg.timestamp?.seconds
                    ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </Timestamp>
              </MsgBubble>
            );
          })}
          <div ref={bottomRef} />
        </Messages>
        <InputRow>
          <Input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={2}
          />
          <Send onClick={sendMessage} disabled={!newText.trim()}>Send</Send>
        </InputRow>
      </Modal>
    </Overlay>
  );
}

// שאר styled-components נשארים כפי שהיו אצלך
// (Overlay, Modal, Header, Name, Close, Messages, MsgBubble, Timestamp, InputRow, Input, Send)

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