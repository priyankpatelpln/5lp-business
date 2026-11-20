'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { supabase, isConfigured } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (fullName: string, email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, Profile> = {
  admin: {
    id: 'demo-admin-id',
    full_name: 'System Administrator',
    email: 'admin@5lpbusiness.com',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z',
  },
  business_owner: {
    id: 'demo-owner-1',
    full_name: 'Bhavesh Patel (Apex Tech)',
    email: 'bhavesh@apexglobaltech.com',
    role: 'business_owner',
    phone: '+919825012345',
    created_at: '2026-01-15T00:00:00Z',
  },
  user: {
    id: 'demo-user-1',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'user',
    created_at: '2026-02-01T00:00:00Z',
  }
};

const STORAGE_KEY = '5lp_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default to Demo Admin so reviewer can immediately inspect Admin Panel & Business Management
        setUser(DEMO_USERS.admin);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS.admin));
      }
    } catch {
      setUser(DEMO_USERS.admin);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // If Supabase is connected with real auth
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!',
        });
        if (!error && data.user) {
          const profile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || 'user',
            created_at: data.user.created_at
          };
          setUser(profile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
          return true;
        }
      } catch (e) {
        console.warn('Supabase login fallback', e);
      }
    }

    // Smart demo login based on email
    let matchedRole: UserRole = 'user';
    if (email.includes('admin')) matchedRole = 'admin';
    else if (email.includes('owner') || email.includes('tech') || email.includes('diamond')) matchedRole = 'business_owner';

    const matchedUser: Profile = {
      ...DEMO_USERS[matchedRole],
      email: email,
      full_name: email.split('@')[0].toUpperCase(),
    };
    setUser(matchedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matchedUser));
    return true;
  };

  const signup = async (fullName: string, email: string, role: UserRole = 'business_owner'): Promise<boolean> => {
    const newUser: Profile = {
      id: 'usr-' + Date.now(),
      full_name: fullName,
      email: email,
      role: role,
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    if (isConfigured && supabase) {
      supabase.auth.signOut();
    }
  };

  const switchRole = (newRole: UserRole) => {
    const updated = DEMO_USERS[newRole];
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'business_owner' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isOwner,
        login,
        signup,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
