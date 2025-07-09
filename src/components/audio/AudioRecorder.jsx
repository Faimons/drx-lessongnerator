// src/components/AudioRecorder.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Upload, Download, Volume2, RotateCcw } from 'lucide-react';

export default function AudioRecorder({ lesson, onUpdate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [audioBlobs, setAudioBlobs] = useState({});
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlobs(prev => ({
          ...prev,
          [currentSlide]: {
            blob: audioBlob,
            url: audioUrl,
            duration: recordingTime
          }
        }));

        // Stream stoppen
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Fehler beim Zugriff auf Mikrofon:', error);
      alert('Mikrofon-Zugriff nicht möglich. Bitte Berechtigung erteilen.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    }
  };

  const playAudio = (slideIndex) => {
    if (audioBlobs[slideIndex]) {
      if (playingAudio === slideIndex) {
        audioElementRef.current.pause();
        setPlayingAudio(null);
      } else {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        
        const audio = new Audio(audioBlobs[slideIndex].url);
        audioElementRef.current = audio;
        audio.play();
        setPlayingAudio(slideIndex);
        
        audio.onended = () => {
          setPlayingAudio(null);
        };
      }
    }
  };

  const deleteRecording = (slideIndex) => {
    if (audioBlobs[slideIndex]) {
      URL.revokeObjectURL(audioBlobs[slideIndex].url);
      const newAudioBlobs = { ...audioBlobs };
      delete newAudioBlobs[slideIndex];
      setAudioBlobs(newAudioBlobs);
    }
  };

  const exportAudio = (slideIndex) => {
    if (audioBlobs[slideIndex]) {
      const link = document.createElement('a');
      link.href = audioBlobs[slideIndex].url;
      link.download = `slide-${slideIndex + 1}-audio.webm`;
      link.click();
    }
  };

  const importAudio = (event, slideIndex) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setAudioBlobs(prev => ({
        ...prev,
        [slideIndex]: {
          blob: file,
          url: audioUrl,
          duration: 0 // Wird beim ersten Abspielen ermittelt
        }
      }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateTextToSpeech = async (slideIndex) => {
    // Placeholder für Text-to-Speech Integration
    // Hier könnte eine API wie Google Text-to-Speech integriert werden
    alert('Text-to-Speech Integration folgt in der nächsten Version');
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🎙️ Audio Recording Studio</h2>
          <div className="text-blue-300 text-sm">
            Slide {currentSlide + 1} von {lesson.totalSlides}
          </div>
        </div>

        {/* Current Slide Info */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold text-blue-400 mb-2">
            {lesson.slides[currentSlide].title}
          </h3>
          <div className="text-gray-300 text-sm mb-3">
            Script ({lesson.slides[currentSlide].audioScript.split(' ').length} Wörter):
          </div>
          <p className="text-white bg-black/30 p-3 rounded text-sm leading-relaxed">
            {lesson.slides[currentSlide].audioScript}
          </p>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-lg"
            >
              <Mic className="w-6 h-6" />
              Aufnahme starten
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Weiter
                </button>
              )}
              
              <button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stopp
              </button>
            </div>
          )}

          <div className="text-white text-xl font-mono">
            {formatTime(recordingTime)}
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center justify-center gap-2 text-red-400">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              {isPaused ? 'Aufnahme pausiert' : 'Aufnahme läuft...'}
            </span>
          </div>
        )}
      </div>

      {/* Slide Navigation & Audio Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slide Navigation */}
        <div className="glass-effect rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-4">Slide Auswahl</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {lesson.slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  currentSlide === index
                    ? 'bg-blue-600/50 border-blue-400'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{slide.title}</p>
                    <p className="text-xs text-gray-300">
                      {slide.audioScript.split(' ').length} Wörter
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {audioBlobs[index] && (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                    <span className="text-xs text-gray-400">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Files Management */}
        <div className="lg:col-span-2 glass-effect rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-4">Audio Dateien</h3>
          <div className="space-y-3">
            {lesson.slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white/10 rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{slide.title}</p>
                    <p className="text-sm text-gray-300">
                      {audioBlobs[index] 
                        ? `Audio verfügbar (${formatTime(audioBlobs[index].duration)})`
                        : 'Kein Audio'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Import Audio */}
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => importAudio(e, index)}
                      className="hidden"
                      id={`import-audio-${index}`}
                    />
                    <label
                      htmlFor={`import-audio-${index}`}
                      className="bg-purple-600 hover:bg-purple-700 p-2 rounded cursor-pointer"
                      title="Audio importieren"
                    >
                      <Upload className="w-4 h-4" />
                    </label>

                    {/* Generate TTS */}
                    <button
                      onClick={() => generateTextToSpeech(index)}
                      className="bg-green-600 hover:bg-green-700 p-2 rounded"
                      title="Text-to-Speech generieren"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {audioBlobs[index] && (
                      <>
                        {/* Play/Pause */}
                        <button
                          onClick={() => playAudio(index)}
                          className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                          title="Abspielen/Pausieren"
                        >
                          {playingAudio === index ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>

                        {/* Export */}
                        <button
                          onClick={() => exportAudio(index)}
                          className="bg-gray-600 hover:bg-gray-700 p-2 rounded"
                          title="Audio exportieren"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteRecording(index)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded"
                          title="Audio löschen"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Statistics */}
      <div className="glass-effect rounded-xl p-4">
        <h3 className="text-lg font-bold text-white mb-4">Aufnahme-Statistiken</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">
              {Object.keys(audioBlobs).length}
            </div>
            <div className="text-sm text-gray-300">Aufnahmen</div>
          </div>
          <div className="bg-green-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">
              {Math.round((Object.keys(audioBlobs).length / lesson.totalSlides) * 100)}%
            </div>
            <div className="text-sm text-gray-300">Abgeschlossen</div>
          </div>
          <div className="bg-purple-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">
              {Object.values(audioBlobs).reduce((total, audio) => total + audio.duration, 0)}s
            </div>
            <div className="text-sm text-gray-300">Gesamt-Audio</div>
          </div>
          <div className="bg-yellow-500/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">
              {lesson.slides.reduce((total, slide) => total + slide.audioScript.split(' ').length, 0)}
            </div>
            <div className="text-sm text-gray-300">Wörter Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}