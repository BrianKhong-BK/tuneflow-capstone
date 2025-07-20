// src/providers/AuthProvider.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // your firebase config file
import { AuthContext } from "../contexts/AuthContext";
import LoadingPage from "../pages/LoadingPage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        setToken(token);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, setUser, setToken, setLoading }}
    >
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}
