import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Prasad Mahajan',
    username: 'prasad_m',
    email: 'prasad@devreview.io',
    role: 'Student',
    karma: 340,
    acceptedRefactors: 8,
    isModMode: false,
  });

  const toggleModMode = () => {
    setUser((prev) => ({
      ...prev,
      isModMode: !prev.isModMode,
    }));
  };

  const switchRole = (newRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
      isModMode: newRole === 'Admin' ? true : prev.isModMode,
    }));
  };

  const addKarma = (points) => {
    setUser((prev) => ({
      ...prev,
      karma: prev.karma + points,
    }));
  };

  const login = (userData) => {
    setUser((prev) => ({
      ...prev,
      ...userData,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        toggleModMode,
        switchRole,
        addKarma,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
