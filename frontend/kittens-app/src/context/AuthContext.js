"use client"
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({displayName:"test",bio:"", avatarUrl:"",following:[]});

  useEffect(() => {
    axios.get('http://localhost:3001/user/api/users/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);
  useEffect(() => {
  console.log('USER:', user);
}, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};