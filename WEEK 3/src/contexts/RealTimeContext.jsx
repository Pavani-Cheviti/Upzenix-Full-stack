import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const RealTimeContext = createContext();

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

export const RealTimeProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const intervalRef = useRef(null);

  // Simulate real-time data updates
  useEffect(() => {
    setIsConnected(true);

    // Simulate initial data
    setBookings([
      { id: 1, movie: 'Avengers: Endgame', tickets: 2, amount: 30, time: new Date() },
      { id: 2, movie: 'Inception', tickets: 1, amount: 15, time: new Date() },
    ]);
    setRevenue(45);
    setActiveUsers(127);

    // Simulate real-time updates every 5-15 seconds
    const scheduleNextUpdate = () => {
      const delay = Math.random() * 10000 + 5000; // 5-15 seconds
      intervalRef.current = setTimeout(() => {
        // Simulate new booking
        const movies = ['Avengers: Endgame', 'Inception', 'The Dark Knight', 'Interstellar', 'Dune'];
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const tickets = Math.floor(Math.random() * 4) + 1;
        const amount = tickets * 15;

        const newBooking = {
          id: Date.now(),
          movie: randomMovie,
          tickets,
          amount,
          time: new Date(),
        };

        setBookings(prev => [newBooking, ...prev].slice(0, 10)); // Keep last 10 bookings
        setRevenue(prev => prev + amount);
        setActiveUsers(prev => Math.max(100, prev + Math.floor(Math.random() * 21) - 10)); // +/- 10 users

        scheduleNextUpdate();
      }, delay);
    };

    scheduleNextUpdate();

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  const disconnect = () => {
    setIsConnected(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  const reconnect = () => {
    setIsConnected(true);
    // Restart the simulation
    window.location.reload(); // Simple way to restart
  };

  return (
    <RealTimeContext.Provider value={{
      isConnected,
      bookings,
      revenue,
      activeUsers,
      disconnect,
      reconnect,
    }}>
      {children}
    </RealTimeContext.Provider>
  );
};