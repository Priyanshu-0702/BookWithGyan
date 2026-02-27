// import { createContext, useState, useEffect } from "react";
// import { getMeApi } from "../api/authApi";

// export const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   // Load user if token exists
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       fetchUser();
//     }
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await getMeApi();
//       setUser(res.data);
//     } catch {
//       logout();
//     }
//   };

//   // Login now only stores token & fetches user
//   const login = async (token) => {
//     localStorage.setItem("token", token);
//     await fetchUser();
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

import { createContext, useState, useEffect } from "react";
import { getMeApi } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getMeApi();
      setUser(res.data);
    } catch (err) {
      // Only logout if truly unauthorized
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}