import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "user" | "vendor";

export interface AppUser {
  email: string;
  name: string;
  role: UserRole;
  company: string;
  phone: string;
  registeredAt: string;
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  company: string;
  phone: string;
}

interface AuthContextType {
  user: AppUser | null;
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: RegisterData) => { success: boolean; error?: string };
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "veridian_users";
const SESSION_STORAGE_KEY = "veridian_session";

interface StoredUser extends AppUser {
  password: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getSession(): AppUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: AppUser | null) {
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
  }, []);

  const register = (data: RegisterData): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser: StoredUser = {
      email: data.email,
      name: data.name,
      role: data.role,
      company: data.company,
      phone: data.phone,
      password: data.password,
      registeredAt: new Date().toISOString(),
    };

    saveStoredUsers([...users, newUser]);
    return { success: true };
  };

  const signIn = (email: string, password: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: "Invalid email or password." };
    }

    const { password: _, ...appUser } = found;
    setUser(appUser);
    saveSession(appUser);
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    saveSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, register, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
