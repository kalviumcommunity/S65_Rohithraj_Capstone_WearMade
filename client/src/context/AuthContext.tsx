import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  // add other user fields as needed
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch user from backend using cookie
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { usernameOrEmail, password },
        { withCredentials: true }
      );
      await fetchUser();
    } catch (error) {
      setUser(null); // Ensure user is cleared on login failure
      throw error; // Re-throw the error so the calling component can handle it
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};