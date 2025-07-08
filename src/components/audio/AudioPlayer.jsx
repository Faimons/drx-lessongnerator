import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

export default function AudioPlayer({ script, isPlaying, onComplete }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const words = script?.split(' ') || [];

  useEffect(() => {
    if (isPlaying && script) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [isPlaying, script]);

  const handlePlay = () => {
    if (!script) return;
    
    setIsPlayingAudio(true);
    
    // Simuliere Text-to-Speech durch Wort-für-Wort Anzeige
    const wordsPerSecond = 2.5; // Sprechgeschwindigkeit
    const interval = 1000 / wordsPerSecond;
    
    intervalRef.current = setInterval(() => {
      setCurrentWord(prev => {
        const nextWord = prev + 1;
        const progressPercent = (nextWord / words.length) * 100;
        setProgress(progressPercent);
        
        if (nextWord >= words.length) {
          // Audio beendet
          setIsPlayingAudio(false);
          if (onComplete) onComplete();
          return prev;
        }
        
        return nextWord;
      });
    }, interval);
  };

  const handlePause = () => {
    setIsPlayingAudio(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    handlePause();
    setCurrentWord(0);
    setProgress(0);
  };

  const togglePlayPause = () => {
    if (isPlayingAudio) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  if (!script) return null;

  return (
    <div className="glass-effect rounded-xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Volume2 className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Audio-Narration</h3>
        <div className="flex-1"></div>
        <span className="text-sm text-blue-300">
          {Math.round(progress)}% abgespielt
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Text mit Highlight */}
      <div className="bg-black/30 rounded-lg p-4 mb-4 text-white text-lg leading-relaxed">
        {words.map((word, index) => (
          <span
            key={index}
            className={`${
              index <= currentWord
                ? 'text-blue-300 font-semibold'
                : 'text-gray-400'
            } transition-colors duration-200`}
          >
            {word}{' '}
          </span>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlayPause}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-colors"
        >
          {isPlayingAudio ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        <div className="text-sm text-blue-300">
          {isPlayingAudio && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Audio läuft...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}