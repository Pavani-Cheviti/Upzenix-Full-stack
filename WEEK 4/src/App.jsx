import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuditProvider } from './contexts/AuditContext';
import { RealTimeProvider } from './contexts/RealTimeContext';
import { GlobalProvider } from './contexts/GlobalContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';
import Tables from './pages/Tables';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';
import Movies from './pages/Movies';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuditProvider>
          <RealTimeProvider>
            <GlobalProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/kanban" element={<Kanban />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/tables" element={<Tables />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/audit-logs" element={<AuditLogs />} />
                  </Routes>
                </Layout>
              </Router>
            </GlobalProvider>
          </RealTimeProvider>
        </AuditProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
