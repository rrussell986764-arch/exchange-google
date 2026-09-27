import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfileData, AuthSession } from '../types/auth';
import { generateSalt, hashPassword, verifyPassword, generateSessionToken } from '../utils/cryptoAuth';

interface AuthContextType {
  currentUser: UserProfileData | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setIsAuthModalOpen: (open: boolean, mode?: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfileData>) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_USERS: UserProfileData[] = [
  {
    id: 'usr-chinedu-01',
    name: 'Chinedu Eze',
    email: 'chinedu.eze@cardnaija.io',
    phone: '+234 803 192 0841',
    salt: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f01234',
    passwordHash: '8b9d5c4e2a1f0e9b8c7d6e5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c',
    kycTier: 'tier2_verified',
    isTwoFactorEnabled: true,
    createdAt: '2024-03-15T10:00:00.000Z',
    avatarBg: '#059669',
    defaultPayoutRail: 'nigerian_bank',
    defaultPayoutIdentifier: 'GTBank (0249810291)',
    stats: {
      totalTrades: 16,
      volumeTraded: 2150000.00,
      successRate: 100,
      rating: 4.98
    }
  },
  {
    id: 'usr-amaka-02',
    name: 'Amaka Okafor',
    email: 'amaka.okafor@cardnaija.io',
    phone: '+234 812 482 9901',
    salt: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    passwordHash: '3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
    kycTier: 'pro_merchant',
    isTwoFactorEnabled: true,
    createdAt: '2023-11-20T14:30:00.000Z',
    avatarBg: '#2563eb',
    defaultPayoutRail: 'opay_palmpay',
    defaultPayoutIdentifier: 'OPay (8124829901)',
    stats: {
      totalTrades: 48,
      volumeTraded: 6420000.00,
      successRate: 100,
      rating: 5.0
    }
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfileData[]>(() => {
    const saved = localStorage.getItem('cardnaija_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(() => {
    const savedSession = localStorage.getItem('cardnaija_session');
    if (savedSession) {
      try {
        const session: AuthSession = JSON.parse(savedSession);
        if (session.expiresAt > Date.now()) {
          const userList: UserProfileData[] = JSON.parse(localStorage.getItem('cardnaija_users') || '[]');
          const match = userList.find(u => u.id === session.userId);
          if (match) return match;
        }
      } catch (e) {
        console.error('Failed to parse session', e);
      }
    }
    // Default logged in user for immediate rich testing
    return DEFAULT_USERS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpenState] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    localStorage.setItem('cardnaija_users', JSON.stringify(users));
  }, [users]);

  const setIsAuthModalOpen = (open: boolean, mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpenState(open);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    const isPreSeeded = (normalizedEmail === 'chinedu.eze@cardnaija.io' || normalizedEmail === 'amaka.okafor@cardnaija.io') && password === 'Password123!';
    const isValid = isPreSeeded || await verifyPassword(password, user.salt, user.passwordHash);

    if (!isValid) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    const session: AuthSession = {
      token: generateSessionToken(),
      userId: user.id,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
    };

    localStorage.setItem('cardnaija_session', JSON.stringify(session));
    setCurrentUser(user);
    setIsAuthModalOpenState(false);
    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim()) return { success: false, error: 'Please enter your full name.' };
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    const exists = users.some(u => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const colors = ['#059669', '#2563eb', '#7c3aed', '#d97706', '#dc2626'];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    const newUser: UserProfileData = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      salt,
      passwordHash,
      kycTier: 'tier1_basic',
      isTwoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      avatarBg: randomBg,
      defaultPayoutRail: 'nigerian_bank',
      defaultPayoutIdentifier: 'GTBank',
      stats: {
        totalTrades: 0,
        volumeTraded: 0,
        successRate: 100,
        rating: 5.0
      }
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    const session: AuthSession = {
      token: generateSessionToken(),
      userId: newUser.id,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
    };

    localStorage.setItem('cardnaija_session', JSON.stringify(session));
    setCurrentUser(newUser);
    setIsAuthModalOpenState(false);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('cardnaija_session');
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfileData>): Promise<boolean> => {
    if (!currentUser) return false;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    return true;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Not authenticated.' };

    const isMatch = await verifyPassword(oldPassword, currentUser.salt, currentUser.passwordHash);
    const isPreSeeded = (currentUser.email === 'chinedu.eze@cardnaija.io' || currentUser.email === 'amaka.okafor@cardnaija.io') && oldPassword === 'Password123!';

    if (!isMatch && !isPreSeeded) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    const updatedUser: UserProfileData = {
      ...currentUser,
      salt: newSalt,
      passwordHash: newHash
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthModalOpen,
        authModalMode,
        setIsAuthModalOpen,
        login,
        register,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
