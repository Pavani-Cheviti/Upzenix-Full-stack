import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs } from '../redux/slices/songsSlice';
import SongCard from './SongCard';

const TopPlay = () => {
  const dispatch = useDispatch();
  const { songs, loading, error } = useSelector((state) => state.songs);
  const { currentSong } = useSelector((state) => state.player);

  useEffect(() => {
    dispatch(fetchSongs('all'));
  }, [dispatch]);

  if (loading) return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Top Plays</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {songs.slice(0, 10).map((song) => (
          <div key={song.id} className="flex-shrink-0 w-48">
            <div className={`relative transition-all duration-300 ${currentSong?.id === song.id ? 'ring-2 ring-blue-600 dark:ring-green-500 rounded-lg scale-105' : ''}`}>
              <SongCard song={song} songs={songs} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPlay;