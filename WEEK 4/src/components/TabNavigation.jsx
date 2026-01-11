import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  KanbanSquare,
  BarChart3,
  Table,
  FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TabNavigation = () => {
  const location = useLocation();
  const { permissions } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', permission: 'canViewDashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', permission: 'canViewCalendar' },
    { path: '/kanban', icon: KanbanSquare, label: 'Kanban', permission: 'canViewKanban' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', permission: 'canViewAnalytics' },
    { path: '/tables', icon: Table, label: 'Tables', permission: 'canViewTables' },
    { path: '/audit-logs', icon: FileText, label: 'Audit Logs', permission: 'canViewAuditLogs' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-soft">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {menuItems
            .filter(item => permissions[item.permission])
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-4 rounded-t-xl text-sm font-semibold transition-all duration-300 border-b-3 whitespace-nowrap relative group ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-blue-500 shadow-medium'
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  <span className="relative">
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-fade-in"></div>
                    )}
                  </span>
                  {isActive && (
                    <div className="absolute inset-x-0 -bottom-px h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-full opacity-80"></div>
                  )}
                </Link>
              );
            })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;