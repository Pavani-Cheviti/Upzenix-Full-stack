import React, { createContext, useContext, useState, useEffect } from 'react';

const AuditContext = createContext();

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};

export const AuditProvider = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState(() => {
    const savedLogs = localStorage.getItem('auditLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  useEffect(() => {
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAction = (action, details, userId = null) => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      userId: userId || 'system',
      ipAddress: '127.0.0.1', // In a real app, this would be fetched
    };

    setAuditLogs(prev => [logEntry, ...prev].slice(0, 1000)); // Keep last 1000 entries
  };

  const clearLogs = () => {
    setAuditLogs([]);
  };

  const getLogsByAction = (action) => {
    return auditLogs.filter(log => log.action === action);
  };

  const getLogsByUser = (userId) => {
    return auditLogs.filter(log => log.userId === userId);
  };

  return (
    <AuditContext.Provider value={{
      auditLogs,
      logAction,
      clearLogs,
      getLogsByAction,
      getLogsByUser,
    }}>
      {children}
    </AuditContext.Provider>
  );
};