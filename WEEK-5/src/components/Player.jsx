import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Repeat1
} from 'lucide-react';
import {
  togglePlayPause,
  setVolume,
  setCurrentTime,
  setDuration,
  playNext,
  playPrevious,
  toggleShuffle,
  setRepeatMode
} from '../redux/slices/playerSlice';

const Player = () => {
  const dispatch = useDispatch();
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffle,
    repeatMode
  } = useSelector((state) => state.player);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      dispatch(setDuration(audioRef.current.duration));
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    dispatch(setCurrentTime(newTime));
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
  };

  const handleNext = () => {
    dispatch(playNext());
  };

  const handlePrevious = () => {
    dispatch(playPrevious());
  };

  const handleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleRepeat = () => {
    dispatch(setRepeatMode());
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e293b] p-4 flex items-center justify-between z-50 shadow-lg dark:shadow-xl border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <audio
        ref={audioRef}
        src={currentSong.preview}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Song Info */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="w-12 h-12 rounded overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 dark:from-green-400 dark:to-blue-600 flex items-center justify-center">
          {currentSong?.artwork ? (
            <img
              src={currentSong.artwork}
              alt={currentSong.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center text-white text-lg font-bold ${currentSong?.artwork ? 'hidden' : 'flex'}`}>
            {currentSong?.title?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold truncate text-gray-900 dark:text-white">{currentSong.title}</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleShuffle}
            className={`p-1 rounded transition-colors duration-300 ${isShuffle ? 'text-blue-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <Shuffle size={16} />
          </button>

          <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-300 text-gray-700 dark:text-gray-300">
            <SkipBack size={20} />
          </button>

          <button
            onClick={() => dispatch(togglePlayPause())}
            className="p-3 bg-blue-600 dark:bg-green-500 hover:bg-blue-700 dark:hover:bg-green-600 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button onClick={handleNext} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-300 text-gray-700 dark:text-gray-300">
            <SkipForward size={20} />
          </button>

          <button
            onClick={handleRepeat}
            className={`p-1 rounded transition-colors duration-300 ${repeatMode !== 'off' ? 'text-blue-600 dark:text-green-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-gray-600 dark:text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 flex-1 max-w-xs justify-end">
        <Volume2 size={20} className="text-gray-700 dark:text-gray-300" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  );
};

export default Player;