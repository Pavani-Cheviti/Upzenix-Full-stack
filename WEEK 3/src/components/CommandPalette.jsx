import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Users, Calendar, KanbanSquare, BarChart3, Table, FileText } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAuth } from '../contexts/AuthContext';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const commands = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      icon: Command,
      action: () => navigate('/'),
      permission: 'canViewDashboard',
    },
    {
      id: 'calendar',
      title: 'Go to Calendar',
      icon: Calendar,
      action: () => navigate('/calendar'),
      permission: 'canViewCalendar',
    },
    {
      id: 'kanban',
      title: 'Go to Kanban Board',
      icon: KanbanSquare,
      action: () => navigate('/kanban'),
      permission: 'canViewKanban',
    },
    {
      id: 'analytics',
      title: 'Go to Analytics',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      permission: 'canViewAnalytics',
    },
    {
      id: 'tables',
      title: 'Go to Users Table',
      icon: Table,
      action: () => navigate('/tables'),
      permission: 'canViewTables',
    },
    {
      id: 'audit-logs',
      title: 'Go to Audit Logs',
      icon: FileText,
      action: () => navigate('/audit-logs'),
      permission: 'canViewAuditLogs',
    },
  ].filter(cmd => permissions[cmd.permission]);

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setIsOpen(true);
  });

  useHotkeys('escape', () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  });

  useHotkeys('enter', () => {
    if (filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
      setQuery('');
      setSelectedIndex(0);
    }
  });

  useHotkeys('arrowdown', () => {
    setSelectedIndex(prev =>
      prev < filteredCommands.length - 1 ? prev + 1 : prev
    );
  });

  useHotkeys('arrowup', () => {
    setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => {
              const Icon = command.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={command.id}
                  onClick={() => {
                    command.action();
                    setIsOpen(false);
                    setQuery('');
                    setSelectedIndex(0);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {command.title}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-xs text-gray-400">↵</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div className="flex items-center space-x-1">
              <Command className="w-3 h-3" />
              <span>+ K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;