
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data for demo purposes - updated with new permission structure
const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder.svg',
  role: 'Super Admin',
  organization: 'Acme Finance',
  permissions: {
    reconSetup: {
      setupNewRecon: true,
      setupValidations: true,
      setupExceptions: true,
      setupRules: true,
      viewReports: true,
      downloadReports: true,
      approvalPermission: true,
    },
    runRecon: {
      runRecon: true,
      approveRecon: true,
      viewReports: true,
      downloadReports: true,
    },
    adminUser: {
      createRecon: true,
      closeExceptions: true,
      viewReports: true,
      editUsers: true,
      viewUsers: true,
      downloadReports: true,
      viewDashboard: true,
      viewAnalytics: true,
    },
    reportUser: {
      viewReports: true,
      viewDashboard: true,
      viewAnalytics: true,
      downloadReports: true,
    },
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, validate the token with your backend
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, make an API call to authenticate
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        // Store token (in real app, this would come from your API)
        localStorage.setItem('auth_token', 'mock_jwt_token');
        setUser(MOCK_USER);
        toast({
          title: "Login successful",
          description: "Welcome back to the Reconciliation Platform",
        });
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('auth_token', 'mock_google_jwt_token');
      setUser(MOCK_USER);
      toast({
        title: "Google login successful",
        description: "Welcome back to the Reconciliation Platform",
      });
    } catch (error) {
      toast({
        title: "Google authentication failed",
        description: "Could not authenticate with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMicrosoft = async () => {
    setIsLoading(true);
    try {
      // Simulate Microsoft OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('auth_token', 'mock_microsoft_jwt_token');
      setUser(MOCK_USER);
      toast({
        title: "Microsoft login successful",
        description: "Welcome back to the Reconciliation Platform",
      });
    } catch (error) {
      toast({
        title: "Microsoft authentication failed",
        description: "Could not authenticate with Microsoft",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
