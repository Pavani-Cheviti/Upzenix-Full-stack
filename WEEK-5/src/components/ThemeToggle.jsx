import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme } from '../redux/slices/themeSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-300 dark:text-gray-400"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;