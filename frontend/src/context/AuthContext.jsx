import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Base backend URL
const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUser(JSON.parse(storedUserInfo));
      } else {
        // Since there is no Login page built yet, we will auto-register/login a Test User
        try {
          // Attempt Login First
          const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'test@example.com',
            password: 'password123'
          });
          setUser(loginRes.data);
          localStorage.setItem('userInfo', JSON.stringify(loginRes.data));
        } catch (error) {
          // If login fails, register the user
          try {
            const regRes = await axios.post(`${API_URL}/register`, {
              name: 'Alex Johnson',
              email: 'test@example.com',
              password: 'password123'
            });
            setUser(regRes.data);
            localStorage.setItem('userInfo', JSON.stringify(regRes.data));
          } catch (e) {
            console.error('Failed to auto-authenticate fallback user:', e);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const updateProfile = async (name, email) => {
    if (!user || (!name && !email)) return;
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(`${API_URL}/profile`, { name, email }, config);
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  if (loading) return <div className="p-10 text-center font-semibold text-gray-500">Initializing Auth...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
