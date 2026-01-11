import React from 'react';
import TabNavigation from './TabNavigation';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900">
      {/* Fixed Topbar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Topbar />
      </div>

      {/* Tab Navigation */}
      <div className="fixed top-16 left-0 right-0 z-30">
        <TabNavigation />
      </div>

      {/* Main Content Area */}
      <div className="pt-32 min-h-screen">
        <main className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
};

export default AdminLayout;