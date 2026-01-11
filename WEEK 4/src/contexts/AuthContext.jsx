import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 1,
      name: 'Admin User',
      email: 'admin@moviebooking.com',
      role: 'Admin', // Admin, Manager, Staff
      avatar: null,
    };
  });

  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));

    // Define permissions based on role
    const rolePermissions = {
      Admin: {
        canViewDashboard: true,
        canViewAnalytics: true,
        canViewCalendar: true,
        canViewKanban: true,
        canViewTables: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canExportData: true,
        canViewAuditLogs: true,
        canManageMovies: true,
        canManageBookings: true,
      },
      Manager: {
        canViewDashboard: true,
        canViewAnalytics: true,
        canViewCalendar: true,
        canViewKanban: true,
        canViewTables: true,
        canEditUsers: false,
        canDeleteUsers: false,
        canExportData: true,
        canViewAuditLogs: false,
        canManageMovies: true,
        canManageBookings: true,
      },
      Staff: {
        canViewDashboard: true,
        canViewAnalytics: false,
        canViewCalendar: true,
        canViewKanban: true,
        canViewTables: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canExportData: false,
        canViewAuditLogs: false,
        canManageMovies: false,
        canManageBookings: true,
      },
    };

    setPermissions(rolePermissions[user.role] || {});
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      permissions,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};