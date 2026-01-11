import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};

export const GlobalProvider = ({ children }) => {
  // Users state
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      joinDate: '2023-01-15',
      totalBookings: 12,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      joinDate: '2023-02-20',
      totalBookings: 8,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 345-6789',
      status: 'inactive',
      joinDate: '2023-03-10',
      totalBookings: 5,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 456-7890',
      status: 'active',
      joinDate: '2023-04-05',
      totalBookings: 15,
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 567-8901',
      status: 'active',
      joinDate: '2023-05-12',
      totalBookings: 9,
    },
  ]);

  // Movies state
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: 'Avengers: Endgame',
      genre: 'Action',
      duration: '181 min',
      rating: 8.4,
      status: 'now_showing',
      releaseDate: '2019-04-26',
      poster: '/api/placeholder/300/450',
      description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins.',
    },
    {
      id: 2,
      title: 'Inception',
      genre: 'Sci-Fi',
      duration: '148 min',
      rating: 8.8,
      status: 'now_showing',
      releaseDate: '2010-07-16',
      poster: '/api/placeholder/300/450',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    },
    {
      id: 3,
      title: 'The Dark Knight',
      genre: 'Action',
      duration: '152 min',
      rating: 9.0,
      status: 'coming_soon',
      releaseDate: '2024-01-15',
      poster: '/api/placeholder/300/450',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.',
    },
    {
      id: 4,
      title: 'Interstellar',
      genre: 'Sci-Fi',
      duration: '169 min',
      rating: 8.6,
      status: 'archived',
      releaseDate: '2014-11-07',
      poster: '/api/placeholder/300/450',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    },
  ]);

  // Bookings state
  const [bookings, setBookings] = useState([
    {
      id: 1,
      userId: 1,
      movieId: 1,
      seats: ['A1', 'A2'],
      totalAmount: 30,
      status: 'confirmed',
      bookingDate: '2024-01-10',
      showTime: '2024-01-10T19:00:00',
    },
    {
      id: 2,
      userId: 2,
      movieId: 2,
      seats: ['B3'],
      totalAmount: 15,
      status: 'confirmed',
      bookingDate: '2024-01-09',
      showTime: '2024-01-09T20:30:00',
    },
    {
      id: 3,
      userId: 4,
      movieId: 1,
      seats: ['C1', 'C2', 'C3'],
      totalAmount: 45,
      status: 'pending',
      bookingDate: '2024-01-11',
      showTime: '2024-01-11T18:00:00',
    },
  ]);

  // Update functions
  const updateUsers = (newUsers) => {
    setUsers(newUsers);
  };

  const updateMovies = (newMovies) => {
    setMovies(newMovies);
  };

  const updateBookings = (newBookings) => {
    setBookings(newBookings);
  };

  const value = {
    users,
    movies,
    bookings,
    updateUsers,
    updateMovies,
    updateBookings,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};