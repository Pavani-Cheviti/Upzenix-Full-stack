import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSongDetails, getTopSongs } from '../services/musicApi';
import useStore from '../stores/useStore';
import Loader from '../components/Loader';
import Error from '../components/Error';
import SongCard from '../components/SongCard';

const SongDetails = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentSong } = useStore();

  useEffect(() => {
    const fetchSongAndRelated = async () => {
      try {
        const songData = await getSongDetails(id);
        setSong(songData);

        // Get related songs (same genre or artist)
        const allSongs = await getTopSongs();
        const related = allSongs
          .filter(s => s.id !== songData.id && (s.genre === songData.genre || s.artist === songData.artist))
          .slice(0, 6);
        setRelatedSongs(related);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSongAndRelated();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!song) return <Error message="Song not found" />;

  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-64 h-64 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 dark:from-green-400 dark:to-blue-600 flex items-center justify-center">
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
          <div className={`w-full h-full flex items-center justify-center text-white text-6xl font-bold ${song?.artwork ? 'hidden' : 'flex'}`}>
            {song?.title?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{song.title}</h1>
          <h2 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">{song.artist}</h2>
          <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">Album: {song.album}</p>
          <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">Genre: {song.genre}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">Duration: {song.duration}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Lyrics</h3>
        {song.lyrics ? (
          <div className="bg-gray-100 dark:bg-[#1e293b] p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
            <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">{song.lyrics}</pre>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Lyrics not available for this song.</p>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Artist</h3>
        <div className="flex items-center space-x-4">
          <img
            src={song?.images?.coverart || song?.images?.background || song?.artwork || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGM0Y0RjYiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSIgZmlsbD0iIzlCOUI5QSIgZm9udC1zaXplPSI4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPk5vIEFydDwvdGV4dD4KPC9zdmc+"}
            alt={song?.subtitle}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{song?.subtitle}</p>
            <p className="text-gray-600 dark:text-gray-400">Artist</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Related Songs</h3>
        {relatedSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedSongs.map((relatedSong) => (
              <div key={relatedSong.id} className={`relative ${currentSong?.id === relatedSong.id ? 'ring-2 ring-green-500 rounded-lg' : ''}`}>
                <SongCard song={relatedSong} songs={relatedSongs} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No related songs found.</p>
        )}
      </div>
    </div>
  );
};

export default SongDetails;