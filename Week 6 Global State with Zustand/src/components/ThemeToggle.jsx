import { Sun, Moon } from 'lucide-react';
import useStore from '../stores/useStore';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useStore();

  const handleToggle = () => {
    toggleTheme();
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