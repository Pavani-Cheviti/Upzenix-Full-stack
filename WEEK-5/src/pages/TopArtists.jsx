import { useEffect, useState } from 'react';
import { getTopArtists } from '../services/musicApi';
import Loader from '../components/Loader';
import Error from '../components/Error';

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await getTopArtists();
        setArtists(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Top Artists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            <div className="text-center">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
              {artist.verified && (
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;