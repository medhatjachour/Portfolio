import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaMusic, FaVolumeUp, FaVolumeMute, FaPlay, FaPause } from 'react-icons/fa';

/**
 * Background Music Player
 * Allows users to toggle ambient background music
 */
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  // Local music file
  const musicUrl = '/interstellar.mp3';
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      
      // Sync state with actual audio playback
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [volume]);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    
    
    if (audio.paused) {
      audio.play().then(() => {
        console.log('Play successful');
      }).catch(err => {
        console.log('Audio play failed:', err);
      });
    } else {
      audio.pause();
    }
  };  const handleVolumeChange = (e) => {
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
        style={{ pointerEvents: 'auto' }}
      >
        {/* Pulsing glow when playing - behind button */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-30 blur-xl animate-pulse pointer-events-none" />
        )}
        
        {/* Main button */}
        <button
          onClick={togglePlay}
          type="button"
          className={` relative z-10 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-emerald-400 shadow-lg shadow-emerald-500/50'
              : 'bg-white/10 border-white/20 hover:border-cyan-400/50'
          }`}
        >
          {isPlaying ? (
            <FaPause className="text-(--color-text) text-lg" />
          ) : (
            <FaPlay className="text-(--color-text) text-lg ml-0.5" />
          )}
        </button>

        {/* Volume controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-16 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-3 flex items-center gap-3"
              style={{ pointerEvents: 'auto' }}
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
      </motion.div>
    </div>
  );
};

export default MusicPlayer;
