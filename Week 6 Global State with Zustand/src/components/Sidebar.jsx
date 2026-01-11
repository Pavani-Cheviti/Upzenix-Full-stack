import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Users } from 'lucide-react';
import useStore from '../stores/useStore';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Sidebar = () => {
  const navigate = useNavigate();
  const { genre, setGenre } = useStore();
  const genres = [
    { label: 'All', value: 'all' },
    { label: 'Pop', value: 'pop' },
    { label: 'Rock', value: 'rock' },
    { label: 'Hip-Hop', value: 'hip-hop' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Classical', value: 'classical' }
  ];

  const handleGenreClick = (genreValue) => {
    setGenre(genreValue);
    // Navigate to discover page if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-[#1e293b] p-6 flex flex-col h-full shadow-lg dark:shadow-xl transition-colors duration-300">
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
      <nav className="space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ${
              isActive ? 'bg-blue-600 dark:bg-green-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
            }`
          }
        >
          <Home size={20} />
          <span>Discover</span>
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ${
              isActive ? 'bg-blue-600 dark:bg-green-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
            }`
          }
        >
          <Search size={20} />
          <span>Search</span>
        </NavLink>
        <NavLink
          to="/top-artists"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ${
              isActive ? 'bg-blue-600 dark:bg-green-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
            }`
          }
        >
          <Users size={20} />
          <span>Top Artists</span>
        </NavLink>
      </nav>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Genres</h3>
        <ul className="space-y-2">
          {genres.map((genreItem) => (
            <li key={genreItem.value}>
              <button
                onClick={() => handleGenreClick(genreItem.value)}
                className={`w-full text-left p-2 rounded transition-colors duration-300 ${
                  genre === genreItem.value
                    ? 'bg-blue-600 dark:bg-green-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {genreItem.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;