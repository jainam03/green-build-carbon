import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "user" | "vendor";

export interface AppUser {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  phone: string;
  registeredAt: string;
  vendorServices?: string[];
  userPurpose?: string;
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  company: string;
  phone: string;
  vendorServices?: string[];
  userPurpose?: string;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Unified Session Management directly from Google Cloud
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom user details (role, company, etc.) from Firestore
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...docSnap.data() } as AppUser);
          } else {
            console.error("No custom Firestore data found for this authenticated user");
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged takes over retrieving the Firestore doc
      return { success: true };
    } catch (err: any) {
      console.error("Login Error:", err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // 1. Create Identity in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = userCredential.user.uid;
      const firebaseUser = userCredential.user;

      try {
        // 2. Build User Profile Document
        const userProfile = {
          email: data.email,
          name: data.name,
          role: data.role,
          company: data.company,
          phone: data.phone,
          registeredAt: new Date().toISOString(),
          ...(data.role === "vendor" ? { vendorServices: data.vendorServices } : {}),
          ...(data.role === "user" ? { userPurpose: data.userPurpose } : {}),
        };

        // 3. Save Custom Data to Cloud Firestore
        await setDoc(doc(db, "users", uid), userProfile);
        
        // onAuthStateChanged automatically logs them in here
        return { success: true };
      } catch (firestoreError: any) {
         // ROLLBACK: Database failed, so delete the orphaned Identity
         console.error("Firestore Save Error. Rolling back user creation.", firestoreError);
         await firebaseUser.delete();
         return { success: false, error: 'Database permissions error. Your account creation was safely rolled back.' };
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged handles clearing state automatically
    } catch (error) {
       console.error("SignOut Error", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        register,
        signOut,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
