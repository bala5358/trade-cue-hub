import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, User } from "@/lib/auth";

/**
 * Whether to use mock authentication (no backend)
 * Set to false once your backend API (http://localhost:5000 or deployed) is live.
 */
const USE_MOCK_AUTH = true;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (USE_MOCK_AUTH) {
          console.warn("⚠️ Mock auth mode active — skipping /api/auth/me call");

          // Mock user for frontend-only development
          const mockUser: User = {
            id: "mock-user-1",
            email: "demo@example.com",
            name: "Demo User",
            roles: ["user"],
          };

          setUser(mockUser);
          setIsAdmin(false); // change to true to test admin routes
        } else {
          // ✅ Real authentication when backend is running
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);

          if (currentUser) {
            const adminStatus = await authService.isAdmin();
            setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    if (USE_MOCK_AUTH) {
      console.log("Mock login successful");
      setUser({
        id: "mock-user-1",
        email,
        name: "Mock User",
        roles: ["user"],
      });
      return;
    }

    const response = await authService.login(email, password);
    if (response.success && response.user) {
      setUser(response.user);
      const adminStatus = await authService.isAdmin();
      setIsAdmin(adminStatus);
    } else {
      throw new Error(response.error || "Login failed");
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    if (USE_MOCK_AUTH) {
      console.log("Mock signup successful");
      setUser({
        id: "mock-user-1",
        email,
        name: name || "Mock User",
        roles: ["user"],
      });
      return;
    }

    const response = await authService.signup(email, password, name);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.error || "Signup failed");
    }
  };

  const logout = async () => {
    if (USE_MOCK_AUTH) {
      console.log("Mock logout");
      setUser(null);
      setIsAdmin(false);
      return;
    }

    await authService.logout();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        signup,
        logout,
      }}
    >
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
