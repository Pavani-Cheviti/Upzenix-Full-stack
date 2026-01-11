import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { searchSongs } from '../services/musicApi';
import SongCard from '../components/SongCard';
import Loader from '../components/Loader';
import Error from '../components/Error';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentSong } = useSelector((state) => state.player);

  useEffect(() => {
    if (query.trim()) {
      const performSearch = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await searchSongs(query);
          setResults(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <input
        type="text"
        placeholder="Search for songs or artists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded-lg mb-6 text-white placeholder-gray-400"
      />
      {loading && <Loader />}
      {error && <Error message={error} />}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((song) => (
            <div key={song.id} className={`relative ${currentSong?.id === song.id ? 'ring-2 ring-green-500 rounded-lg' : ''}`}>
              <SongCard song={song} songs={results} />
            </div>
          ))}
        </div>
      )}
      {!loading && !error && query && results.length === 0 && (
        <p className="text-center text-gray-400">No results found for &quot;{query}&quot;</p>
      )}
    </div>
  );
};

export default Search;