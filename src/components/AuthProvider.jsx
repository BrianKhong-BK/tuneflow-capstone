import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";
import LoadingPage from "../pages/LoadingPage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const freshToken = await user.getIdToken();
        setUser(user);
        setToken(freshToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Force refresh the token every 55 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const refreshedToken = await currentUser.getIdToken(true); // true = force refresh
        setToken(refreshedToken);
      }
    }, 55 * 60 * 1000); // every 55 minutes

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
