// src/components/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const login = (name) => {
    localStorage.setItem('name', name);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem('name');
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
