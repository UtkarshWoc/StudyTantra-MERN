import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: 1, name: 'Alex Johnson', email: 'alex.johnson@example.com' });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
