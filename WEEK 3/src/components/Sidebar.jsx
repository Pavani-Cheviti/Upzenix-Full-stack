import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  KanbanSquare,
  BarChart3,
  Table,
  FileText,
  Moon,
  Sun,
  Menu,
  X,
  Users,
  Film,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { permissions } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', permission: 'canViewDashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', permission: 'canViewCalendar' },
    { path: '/kanban', icon: KanbanSquare, label: 'Kanban', permission: 'canViewKanban' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', permission: 'canViewAnalytics' },
    { path: '/tables', icon: Table, label: 'Tables', permission: 'canViewTables' },
    { path: '/users', icon: Users, label: 'Users', permission: 'canViewUsers' },
    { path: '/movies', icon: Film, label: 'Movies', permission: 'canViewMovies' },
    { path: '/audit-logs', icon: FileText, label: 'Audit Logs', permission: 'canViewAuditLogs' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white truncate">
            MovieBooking
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {menuItems
            .filter(item => permissions[item.permission])
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                        : ''
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-gray-900 dark:group-hover:text-gray-100'
                    }`} />
                    {!collapsed && (
                      <span className={`font-medium transition-opacity ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} text-yellow-500`} />
          ) : (
            <Moon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} text-blue-500`} />
          )}
          {!collapsed && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;