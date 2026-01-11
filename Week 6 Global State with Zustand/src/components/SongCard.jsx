import { Play, Pause } from 'lucide-react';
import useStore from '../stores/useStore';

const SongCard = ({ song, songs = [] }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlayPause, setQueue } = useStore();

  const isCurrentSong = currentSong?.id === song.id;

  const handlePlayPause = () => {
    if (!isCurrentSong) {
      // Set the queue if not already set
      if (songs.length > 0) {
        setQueue(songs);
      }
      setCurrentSong(song);
    } else {
      togglePlayPause();
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 group shadow-sm dark:shadow-md">
      <div className="relative mb-4">
        <div className="w-full aspect-square rounded overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 dark:from-green-400 dark:to-blue-600">
          {song?.artwork ? (
            <img
              src={song.artwork}
              alt={song.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center text-white text-4xl font-bold ${song?.artwork ? 'hidden' : 'flex'}`}>
            {song?.title?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
        <button
          onClick={handlePlayPause}
          className="absolute bottom-2 right-2 bg-blue-600 dark:bg-green-500 hover:bg-blue-700 dark:hover:bg-green-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
        >
          {isCurrentSong && isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
      <h3 className="font-semibold truncate text-gray-900 dark:text-white">{song.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{song.artist}</p>
    </div>
  );
};

export default SongCard;