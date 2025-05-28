import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import {
  getFirestore, collection, query, orderBy,
  onSnapshot, addDoc, serverTimestamp,
  doc, getDoc, setDoc, updateDoc
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

function createChatId(email1, email2) {
  return [email1, email2].sort().join('_');
}

export default function ChatModal({ isOpen, onClose, userEmail, otherEmail, otherUsername }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    if (userEmail && otherEmail) {
      const id = createChatId(userEmail, otherEmail);
      setChatId(id);
    }
  }, [userEmail, otherEmail]);

  useEffect(() => {
    if (!chatId) return;

    // מסמנים את ההודעה האחרונה כנקראת
    markLastMessageAsRead(chatId, userEmail);

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId, userEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newText.trim() || !chatId) return;

    try {
      const chatDocRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatDocRef);

      const lastMessageObj = {
        text: newText.trim(),
        sender: userEmail,
        timestamp: serverTimestamp(),
        readBy: [userEmail], // השולח כבר ראה את ההודעה
      };

      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          participants: [userEmail, otherEmail],
          createdAt: serverTimestamp(),
          lastMessage: lastMessageObj,
        });
      } else {
        await updateDoc(chatDocRef, {
          lastMessage: lastMessageObj,
          updatedAt: serverTimestamp(),
        });
      }

      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: newText.trim(),
        sender_email: userEmail,
        timestamp: serverTimestamp(),
        readBy: [userEmail], // השולח כבר ראה את ההודעה
      });

      setNewText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // פונקציה לסימון ההודעה האחרונה כנקראת ע"י המשתמש
  const markLastMessageAsRead = async (chatId, currentUserEmail) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) return;

      const lastMessage = chatSnap.data().lastMessage;
      if (!lastMessage) return;

      if (!lastMessage.readBy.includes(currentUserEmail)) {
        const updatedReadBy = [...lastMessage.readBy, currentUserEmail];
        await updateDoc(chatRef, {
          "lastMessage.readBy": updatedReadBy,
        });
      }
    } catch (error) {
      console.error('Error marking last message as read:', error);
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
          <Name>{otherUsername}</Name>
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
          <Send onClick={sendMessage}>Send</Send>
        </InputRow>
      </Modal>
    </Overlay>
  );
}

// Styled Components - לא שיניתי אותם
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  padding: 40px 30px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 1rem;
  color: #000;
`;

const Close = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #f39c12;
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
  padding: 12px 18px;
  margin: 6px 0;
  border-radius: 18px;
  border-bottom-${props => (props.isMine ? 'right' : 'left')}-radius: 6px;
  max-width: 75%;
  word-wrap: break-word;
  position: relative;
`;

const Timestamp = styled.span`
  font-size: 0.7rem;
  position: absolute;
  bottom: -18px;
  right: ${props => (props.isMine ? '10px' : 'unset')};
  left: ${props => (!props.isMine ? '10px' : 'unset')};
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 14px 16px;
  border: 1.8px solid #d1d5db;
  border-radius: 10px;
  resize: none;
  font-size: 1rem;
`;

const Send = styled.button`
  padding: 12px 20px;
  background: #f39c12;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;
