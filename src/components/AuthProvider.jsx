import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";
import LoadingPage from "../pages/LoadingPage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen for token changes (login/logout/auto-refresh by Firebase)
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken(); // fresh token
        setUser(user);
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Force refresh token every 55 minutes (just in case)
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true); // force refresh
        setToken(idToken);
      }
    }, 55 * 60 * 1000); // 55 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, setUser, setToken, setLoading }}
    >
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
}
