import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Home, Volume2, VolumeX } from 'lucide-react';
import SlideRenderer from './slides/SlideRenderer';
import AudioPlayer from './audio/AudioPlayer';
import ProgressBar from './navigation/ProgressBar';

export default function LessonViewer({ lesson, onBack, onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [slideProgress, setSlideProgress] = useState({});
  const [lessonStartTime] = useState(Date.now());

  const totalSlides = lesson.slides?.length || 0;
  const slide = lesson.slides?.[currentSlide];

  // Auto-play Logic
  useEffect(() => {
    if (!isAutoPlay || !slide) return;

    const timer = setTimeout(() => {
      handleNextSlide();
    }, 60000); // 60 Sekunden pro Slide

    return () => clearTimeout(timer);
  }, [currentSlide, isAutoPlay, slide]);

  const handleNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setSlideProgress(prev => ({
        ...prev,
        [currentSlide]: { completed: true, timeSpent: Date.now() - lessonStartTime }
      }));
      setCurrentSlide(prev => prev + 1);
    } else {
      // Lektion abgeschlossen
      if (onComplete) {
        onComplete({
          lessonId: lesson.id,
          totalSlides,
          completedSlides: Object.keys(slideProgress).length + 1,
          totalTime: Date.now() - lessonStartTime
        });
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSlideJump = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  if (!slide) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Keine Slides gefunden</h2>
          <button onClick={onBack} className="bg-blue-600 px-6 py-3 rounded-lg">
            Zurück zur Auswahl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass-effect p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-white hover:text-blue-300 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
            <p className="text-blue-300 text-sm">
              Slide {currentSlide + 1} von {totalSlides}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              audioEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              isAutoPlay ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
            }`}
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoPlay ? 'Auto Stop' : 'Auto Play'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onSlideClick={handleSlideJump}
        completedSlides={Object.keys(slideProgress)}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <SlideRenderer 
            slide={slide} 
            slideIndex={currentSlide}
            totalSlides={totalSlides}
          />
        </div>
      </div>

      {/* Audio Player */}
      {audioEnabled && slide.audioScript && (
        <div className="p-4">
          <AudioPlayer
            script={slide.audioScript}
            isPlaying={isAutoPlay}
            onComplete={() => {
              // Audio beendet, gehe zur nächsten Slide
              if (isAutoPlay) {
                setTimeout(() => handleNextSlide(), 2000);
              }
            }}
          />
        </div>
      )}

      {/* Navigation Controls */}
      <div className="glass-effect p-4 flex items-center justify-center gap-4">
        <button
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Zurück
        </button>

        <div className="flex items-center gap-2 text-white">
          <span className="text-sm font-medium">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>

        <button
          onClick={handleNextSlide}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2"
        >
          {currentSlide === totalSlides - 1 ? 'Abschließen' : 'Weiter'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}