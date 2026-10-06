// // import React, { createContext, useState } from 'react';

// // export const UserContext = createContext();

// // export function UserProvider({ children }) {
// //   const [user, setUser] = useState({
// //     name: 'Prasad Mahajan',
// //     username: 'prasad_m',
// //     email: 'prasad@devreview.io',
// //     role: 'Student',
// //     karma: 340,
// //     acceptedRefactors: 8,
// //     isModMode: false,
// //   });

// //   const toggleModMode = () => {
// //     setUser((prev) => ({
// //       ...prev,
// //       isModMode: !prev.isModMode,
// //     }));
// //   };

// //   const switchRole = (newRole) => {
// //     setUser((prev) => ({
// //       ...prev,
// //       role: newRole,
// //       isModMode: newRole === 'Admin' ? true : prev.isModMode,
// //     }));
// //   };

// //   const addKarma = (points) => {
// //     setUser((prev) => ({
// //       ...prev,
// //       karma: prev.karma + points,
// //     }));
// //   };

// //   const login = (userData) => {
// //     setUser((prev) => ({
// //       ...prev,
// //       ...userData,
// //     }));
// //   };

// //   return (
// //     <UserContext.Provider
// //       value={{
// //         user,
// //         toggleModMode,
// //         switchRole,
// //         addKarma,
// //         login,
// //       }}
// //     >
// //       {children}
// //     </UserContext.Provider>
// //   );
// // }


// import React, { createContext, useContext, useEffect, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   const fetchProfile = async () => {
//     const storedToken = localStorage.getItem("token");

//     if (!storedToken) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/users/profile",
//         {
//           headers: {
//             Authorization: `Bearer ${storedToken}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         localStorage.removeItem("token");
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       const data = await response.json();

//       setUser(data);
//     } catch (error) {
//       console.error("Profile verification failed:", error);
//       localStorage.removeItem("token");
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         setUser,
//         login,
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   return useContext(UserContext);
// };

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error("Profile verification failed:", error);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};