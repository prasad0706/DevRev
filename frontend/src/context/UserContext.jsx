import React, { createContext, useState } from 'react';

// 1. Create the Context for sharing User and Role data without prop drilling
export const UserContext = createContext();

export function UserProvider({ children }) {
  // Shared user state (represents authenticated developer)
  const [user, setUser] = useState({
    name: 'Prasad Mahajan',
    username: 'prasad_m',
    email: 'prasad@devreview.io',
    role: 'Student', // Can be 'Student', 'Verified Reviewer', or 'Admin'
    karma: 340,
    acceptedRefactors: 8,
    isModMode: false,
  });

  // Simple function to toggle Moderator privileges
  const toggleModMode = () => {
    setUser((prev) => ({
      ...prev,
      isModMode: !prev.isModMode,
    }));
  };

  // Simple function to switch roles (Student <-> Verified Reviewer <-> Admin)
  const switchRole = (newRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
      isModMode: newRole === 'Admin' ? true : prev.isModMode,
    }));
  };

  // Simple function to add karma points on reviews / upvotes
  const addKarma = (points) => {
    setUser((prev) => ({
      ...prev,
      karma: prev.karma + points,
    }));
  };

  // Login handler
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
