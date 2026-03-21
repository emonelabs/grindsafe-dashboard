import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'player';
  loginTime: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const STORAGE_KEY = 'grindsafe_user_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const parsedUser: User = JSON.parse(storedSession);
        const now = Date.now();
        const sessionAge = now - parsedUser.loginTime;

        // Check if session is still valid (less than 1 hour old)
        if (sessionAge < SESSION_TIMEOUT) {
          setUser(parsedUser);
        } else {
          // Session expired
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Auto-logout after 1 hour of inactivity
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const now = Date.now();
      const sessionAge = now - user.loginTime;

      if (sessionAge >= SESSION_TIMEOUT) {
        logout();
        alert('Your session has expired. Please log in again.');
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [user]);

  // Update last activity time on user interaction
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      const updatedUser = { ...user, loginTime: Date.now() };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    };

    // Reset timer on any user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [user]);

  const login = async (email: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine role based on explicit email mapping or pattern
    const emailLower = email.toLowerCase();
    let role: 'admin' | 'player';
    if (emailLower === 'admin123@testgrindsafe.com') {
      role = 'admin';
    } else if (emailLower === 'player321@testgrindsafe.com') {
      role = 'player';
    } else {
      role = email.includes('admin') ? 'admin' : 'player';
    }
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const newUser: User = {
      email,
      name,
      role,
      loginTime: Date.now()
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
