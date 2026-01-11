import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs, setGenre } from '../redux/slices/songsSlice';
import SongCard from '../components/SongCard';
import Loader from '../components/Loader';
import Error from '../components/Error';
import TopPlay from '../components/TopPlay';

const Discover = () => {
  const dispatch = useDispatch();
  const { songs, genre, loading, error } = useSelector((state) => state.songs);
  const { currentSong } = useSelector((state) => state.player);

  useEffect(() => {
    dispatch(fetchSongs(genre));
  }, [dispatch, genre]);

  const handleGenreChange = (newGenre) => {
    dispatch(setGenre(newGenre));
  };

  return (
    <div className="p-6">
      <TopPlay />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Discover</h1>
        <div className="flex space-x-4 mb-6">
          {['all', 'pop', 'rock', 'hip-hop'].map((g) => (
            <button
              key={g}
              onClick={() => handleGenreChange(g)}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                genre === g
                  ? 'bg-blue-600 dark:bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
              }`}
            >
              {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {loading && <Loader />}
      {error && <Error message={error} />}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div key={song.id} className={`relative transition-all duration-300 ${currentSong?.id === song.id ? 'ring-2 ring-blue-600 dark:ring-green-500 rounded-lg scale-105' : ''}`}>
              <SongCard song={song} songs={songs} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;