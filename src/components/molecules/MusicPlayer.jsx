import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaMusic, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

/**
 * Background Music Player
 * Allows users to toggle ambient background music
 */
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  // You can replace this with your own ambient music file
  const musicUrl = 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <audio ref={audioRef} loop>
        <source src={musicUrl} type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main button */}
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all ${
            isPlaying
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 shadow-lg shadow-purple-500/50'
              : 'bg-white/10 border-white/20 hover:border-white/40'
          }`}
        >
          {isPlaying ? (
            <FaMusic className="text-white text-xl animate-pulse" />
          ) : (
            <FaMusic className="text-white text-xl" />
          )}
        </motion.button>

        {/* Volume controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-16 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 flex items-center gap-3"
            >
              <FaVolumeMute className="text-white text-sm" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <FaVolumeUp className="text-white text-sm" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing glow when playing */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-xl animate-pulse" />
        )}
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
