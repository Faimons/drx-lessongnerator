import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Home, RotateCcw } from 'lucide-react';

// Lesson Data Structure (Ihre Daten)
const lessonData = {
  id: 3,
  title: "Charts verstehen - Die Sprache der Märkte",
  totalSlides: 3, // Korrigiert auf tatsächliche Anzahl
  slides: [
    {
      id: 1,
      title: "📊 Lektion 3: Charts verstehen",
      subtitle: "Die Sprache der Märkte lernen - Vollständiger Kurs",
      type: "intro",
      audioScript: "Willkommen zu Lektion 3 über Charts. Charts sind die Sprache der Märkte und ohne sie zu verstehen, ist Trading wie Autofahren mit verbundenen Augen. In den nächsten 20 Minuten lernen Sie alles Wichtige über Charts.",
      content: {
        objectives: [
          "Charts als Grundsprache des Tradings verstehen",
          "Achsen, Datenpunkte und Zeitrahmen interpretieren", 
          "Chart-Typen und praktische Anwendung",
          "Häufige Anfänger-Fehler vermeiden"
        ],
        warning: "Sie sind in Lektion 3 von 15. Charts zu verstehen ist fundamental, aber Sie sind noch sehr weit davon entfernt, echte Trades zu platzieren."
      }
    },
    {
      id: 2,
      title: "🤔 Was ist ein Chart eigentlich?",
      type: "concept",
      audioScript: "Ein Chart ist nichts anderes als eine visuelle Geschichte davon, wie sich der Preis eines Assets über die Zeit verändert hat. Stellen Sie sich vor, Sie würden jede Stunde den Preis von Bitcoin aufschreiben und diese Punkte dann verbinden - das wäre ein Chart. Unser Gehirn ist darauf programmiert, visuelle Muster zu erkennen.",
      content: {
        explanation: "Ein Chart ist nichts anderes als eine visuelle Geschichte davon, wie sich der Preis eines Assets über die Zeit verändert hat. Stellen Sie sich vor, Sie würden jede Stunde den Preis von Bitcoin aufschreiben und diese Punkte dann verbinden - das wäre ein Chart.",
        examples: {
          withoutChart: {
            title: "📝 Ohne Chart (Zahlen-Chaos)",
            data: [
              "09:00 - 1.0850",
              "10:00 - 1.0847", 
              "11:00 - 1.0863",
              "12:00 - 1.0841",
              "13:00 - 1.0856",
              "14:00 - 1.0872",
              "15:00 - 1.0839"
            ],
            question: "Können Sie hier einen Trend erkennen? Schwierig, oder?"
          },
          withChart: {
            title: "📊 Mit Chart (Sofort verständlich)",
            conclusion: "Jetzt sehen Sie sofort: volatil mit Abwärtstrend am Ende."
          }
        },
        keyPoint: "Unser Gehirn ist darauf programmiert, visuelle Muster zu erkennen. Wenn Sie Hunderte von Zahlen sehen, überfordert das Ihr Gehirn. Aber wenn dieselben Daten als Chart dargestellt werden, können Sie sofort Trends, Muster und Wendepunkte erkennen."
      }
    },
    {
      id: 3,
      title: "💡 Warum sind Charts für Trading so wichtig?",
      type: "importance",
      audioScript: "Charts sind für Trader das, was Röntgenbilder für Ärzte sind - sie zeigen das Innenleben eines Marktes. Ohne Charts würden Sie blind handeln. Mit Charts können Sie zumindest educated guesses machen. Aber denken Sie daran: Charts zeigen nur die Vergangenheit, nicht die Zukunft.",
      content: {
        explanation: "Charts sind für Trader das, was Röntgenbilder für Ärzte sind - sie zeigen das Innenleben eines Marktes. Ohne Charts würden Sie blind handeln. Mit Charts können Sie zumindest educated guesses machen.",
        comparisons: [
          {
            scenario: "🏥 Arzt ohne Röntgenbild",
            description: "Ihr Bein tut weh? Hmm, vielleicht ist es gebrochen, vielleicht nur ein Muskel. Ich rate mal...",
            status: "dangerous"
          },
          {
            scenario: "🏥 Arzt mit Röntgenbild", 
            description: "Das Röntgenbild zeigt einen klaren Bruch im Wadenbein. Hier ist der genaue Behandlungsplan...",
            status: "professional"
          },
          {
            scenario: "📈 Trader ohne Chart",
            description: "EUR/USD bewegt sich heute. Vielleicht sollte ich kaufen oder verkaufen. Ich rate mal...",
            status: "dangerous"
          },
          {
            scenario: "📈 Trader mit Chart",
            description: "Der Chart zeigt einen klaren Aufwärtstrend mit Support bei 1.0850. Hier ist mein Trading-Plan...", 
            status: "professional"
          }
        ],
        warning: "Charts zeigen nur die Vergangenheit, nicht die Zukunft. Sie sind ein Werkzeug zur Wahrscheinlichkeitseinschätzung, keine Kristallkugel."
      }
    }
  ]
};

// Audio Player Component
function AudioPlayer({ script, isPlaying, onComplete }) {
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
    const wordsPerSecond = 2.5; // Sprechgeschwindigkeit
    const interval = 1000 / wordsPerSecond;
    
    intervalRef.current = setInterval(() => {
      setCurrentWord(prev => {
        const nextWord = prev + 1;
        const progressPercent = (nextWord / words.length) * 100;
        setProgress(progressPercent);
        
        if (nextWord >= words.length) {
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

  if (!script) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mx-auto max-w-4xl mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Volume2 className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-bold text-white">🎙️ Audio-Narration</h3>
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

      {/* Text mit Highlighting */}
      <div className="bg-black/30 rounded-lg p-4 mb-4 text-white text-lg leading-relaxed max-h-32 overflow-y-auto">
        {words.map((word, index) => (
          <span
            key={index}
            className={`${
              index <= currentWord
                ? 'text-blue-300 font-semibold bg-blue-500/20 px-1 rounded'
                : 'text-gray-400'
            } transition-all duration-200`}
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
          title="Zurückspulen"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => isPlayingAudio ? handlePause() : handlePlay()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-colors"
          title={isPlayingAudio ? 'Pause' : 'Abspielen'}
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

// Main Lesson Component
export default function InteractiveLessonComponent({ onBack, onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completedSlides, setCompletedSlides] = useState(new Set());
  const [timeOnSlide, setTimeOnSlide] = useState(0);

  const lesson = lessonData;
  const slide = lesson.slides[currentSlide];

  // Timer für Slide-Zeit
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnSlide(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Autoplay Logic
  useEffect(() => {
    if (!autoplay) return;

    const timer = setTimeout(() => {
      if (currentSlide < lesson.totalSlides - 1) {
        handleNextSlide();
      } else {
        setAutoplay(false);
      }
    }, 45000); // 45 Sekunden pro Slide

    return () => clearTimeout(timer);
  }, [currentSlide, autoplay]);

  const handleNextSlide = () => {
    if (currentSlide < lesson.totalSlides - 1) {
      setCompletedSlides(prev => new Set([...prev, currentSlide]));
      setCurrentSlide(prev => prev + 1);
      setTimeOnSlide(0);
    } else {
      // Lektion abgeschlossen
      if (onComplete) {
        onComplete({
          lessonId: lesson.id,
          totalTimeSpent: Array.from(completedSlides).length * 60,
          slidesCompleted: completedSlides.size + 1
        });
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setTimeOnSlide(0);
    }
  };

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'intro':
        return <IntroSlide slide={slide} />;
      case 'concept':
        return <ConceptSlide slide={slide} />;
      case 'importance':
        return <ImportanceSlide slide={slide} />;
      default:
        return <div className="text-white text-center">Slide-Typ nicht unterstützt</div>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="text-white hover:text-blue-300 transition-colors"
              title="Zurück zur Auswahl"
            >
              <Home className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
            <p className="text-blue-300 text-sm">
              Slide {currentSlide + 1} von {lesson.totalSlides}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              audioEnabled ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
            title={audioEnabled ? 'Audio deaktivieren' : 'Audio aktivieren'}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <span className="text-sm text-blue-300">
            {Math.floor(timeOnSlide / 60)}:{(timeOnSlide % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / lesson.totalSlides) * 100}%` }}
        />
      </div>

      {/* Audio Player */}
      {audioEnabled && slide.audioScript && (
        <div className="p-6">
          <AudioPlayer
            script={slide.audioScript}
            isPlaying={autoplay}
            onComplete={() => {
              if (autoplay) {
                setTimeout(() => handleNextSlide(), 2000);
              }
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          {renderSlideContent()}
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-50">
        <button
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Zurück
        </button>

        <button
          onClick={() => setAutoplay(!autoplay)}
          className={`px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center gap-2 ${
            autoplay ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {autoplay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {autoplay ? 'Auto Stop' : 'Auto Play'}
        </button>

        <button
          onClick={handleNextSlide}
          disabled={currentSlide === lesson.totalSlides - 1}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center gap-2"
        >
          {currentSlide === lesson.totalSlides - 1 ? 'Abschließen' : 'Weiter'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Slide Components (Ihre bestehenden Komponenten, leicht angepasst)
function IntroSlide({ slide }) {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {slide.title}
      </h1>
      <h2 className="text-2xl text-blue-300 font-semibold">
        {slide.subtitle}
      </h2>
      
      <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-6 mt-8">
        <h3 className="text-2xl font-bold text-green-400 mb-4">🎯 Was Sie in den nächsten 20 Minuten lernen</h3>
        <ul className="text-left space-y-3 text-lg">
          {slide.content.objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-green-400 font-bold">•</span>
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-2xl p-6 mt-6">
        <h4 className="text-yellow-400 font-bold text-lg mb-2">⚠️ Wichtige Erinnerung:</h4>
        <p className="text-yellow-100">{slide.content.warning}</p>
      </div>
    </div>
  );
}

function ConceptSlide({ slide }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-4xl font-bold text-blue-400 mb-6">{slide.title}</h2>
      
      <p className="text-xl leading-relaxed text-gray-200">
        {slide.content.explanation}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Ohne Chart */}
        <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6">
          <h4 className="text-xl font-bold text-red-400 mb-4">
            {slide.content.examples.withoutChart.title}
          </h4>
          <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-1">
            {slide.content.examples.withoutChart.data.map((entry, index) => (
              <div key={index} className="text-green-400">{entry}</div>
            ))}
          </div>
          <p className="mt-4 text-red-300">{slide.content.examples.withoutChart.question}</p>
        </div>

        {/* Mit Chart */}
        <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6">
          <h4 className="text-xl font-bold text-green-400 mb-4">
            {slide.content.examples.withChart.title}
          </h4>
          <div className="bg-black rounded-lg p-4 h-48 relative">
            <svg className="w-full h-full">
              <polyline
                points="20,120 50,110 80,130 110,90 140,100 170,140 200,80"
                fill="none"
                stroke="#00ff88"
                strokeWidth="2"
              />
              {[
                {x: 20, y: 120}, {x: 50, y: 110}, {x: 80, y: 130},
                {x: 110, y: 90}, {x: 140, y: 100}, {x: 170, y: 140}, {x: 200, y: 80}
              ].map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#ffd700"
                  stroke="#fff"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          <p className="mt-4 text-green-300">{slide.content.examples.withChart.conclusion}</p>
        </div>
      </div>

      <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-6">
        <h4 className="text-blue-400 font-bold text-lg mb-2">🎯 Warum Charts so mächtig sind</h4>
        <p className="text-blue-100">{slide.content.keyPoint}</p>
      </div>
    </div>
  );
}

function ImportanceSlide({ slide }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-4xl font-bold text-blue-400 mb-6">{slide.title}</h2>
      
      <p className="text-xl leading-relaxed text-gray-200 mb-8">
        {slide.content.explanation}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slide.content.comparisons.map((comparison, index) => (
          <div 
            key={index} 
            className={`rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
              comparison.status === 'dangerous' 
                ? 'bg-red-500/20 border-red-500' 
                : 'bg-green-500/20 border-green-500'
            }`}
          >
            <h4 className={`text-lg font-bold mb-3 ${
              comparison.status === 'dangerous' ? 'text-red-400' : 'text-green-400'
            }`}>
              {comparison.scenario}
            </h4>
            <p className={`mb-4 ${
              comparison.status === 'dangerous' ? 'text-red-200' : 'text-green-200'
            }`}>
              {comparison.description}
            </p>
            <div className={`font-bold ${
              comparison.status === 'dangerous' ? 'text-red-400' : 'text-green-400'
            }`}>
              {comparison.status === 'dangerous' ? '❌ Gefährlich und unprofessionell' : '✅ Informiert und professionell'}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-6">
        <h4 className="text-yellow-400 font-bold text-lg mb-2">⚠️ Wichtig:</h4>
        <p className="text-yellow-100">{slide.content.warning}</p>
      </div>
    </div>
  );
}