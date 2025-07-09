// src/App.jsx - Hauptkomponente
import React, { useState, useEffect } from 'react';
import { Upload, Download, Play, Pause, Settings, FileText, Mic } from 'lucide-react';
import LessonViewer from './components/LessonViewer';
import ScriptEditor from './components/ScriptEditor';
import AudioRecorder from './components/AudioRecorder';

// Template für neue Lektionen
const createLessonTemplate = (slideCount = 15) => ({
  id: Date.now(),
  title: "Neue Lektion",
  description: "Beschreibung der Lektion",
  totalSlides: slideCount,
  settings: {
    autoPlaySpeed: 30000, // 30 Sekunden pro Slide
    audioSpeed: 1.0,
    showProgress: true,
    allowSkip: true
  },
  slides: Array.from({ length: slideCount }, (_, index) => ({
    id: index + 1,
    title: `Slide ${index + 1}`,
    type: index === 0 ? 'intro' : index === slideCount - 1 ? 'conclusion' : 'content',
    duration: 30000,
    audioScript: `Dies ist der Sprechtext für Slide ${index + 1}. Hier erklären Sie den wichtigen Inhalt für Ihre Lernenden.`,
    content: {
      headline: `Überschrift für Slide ${index + 1}`,
      text: `Hauptinhalt für diese Slide. Erklären Sie hier das wichtige Konzept ausführlich und verständlich.`,
      bulletPoints: [
        `Wichtiger Punkt 1`,
        `Wichtiger Punkt 2`,
        `Wichtiger Punkt 3`
      ],
      image: null,
      callToAction: index === slideCount - 1 ? "Jetzt anwenden!" : null
    }
  }))
});

export default function App() {
  const [currentLesson, setCurrentLesson] = useState(createLessonTemplate());
  const [mode, setMode] = useState('editor'); // 'editor', 'preview', 'record'
  const [isPlaying, setIsPlaying] = useState(false);

  // Lektion importieren
  const importLesson = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setCurrentLesson(imported);
          alert('✅ Lektion importiert');
        } catch (error) {
          alert('❌ Fehler beim Import');
        }
      };
      reader.readAsText(file);
    }
  };

  // Lektion exportieren
  const exportLesson = () => {
    const dataStr = JSON.stringify(currentLesson, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentLesson.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Neue Lektion erstellen
  const createNewLesson = () => {
    const slideCount = prompt('Anzahl Slides (15-25):', '15');
    if (slideCount && slideCount >= 15 && slideCount <= 25) {
      setCurrentLesson(createLessonTemplate(parseInt(slideCount)));
      setMode('editor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="glass-effect p-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{currentLesson.title}</h1>
              <p className="text-blue-300 text-sm">{currentLesson.totalSlides} Slides</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Buttons */}
            <div className="flex bg-black/30 rounded-lg p-1">
              <button
                onClick={() => setMode('editor')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'editor' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setMode('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Vorschau
              </button>
              <button
                onClick={() => setMode('record')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'record' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={createNewLesson}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Neue Lektion
            </button>

            <input
              type="file"
              accept=".json"
              onChange={importLesson}
              className="hidden"
              id="import-lesson"
            />
            <label
              htmlFor="import-lesson"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </label>

            <button
              onClick={exportLesson}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {mode === 'editor' && (
          <ScriptEditor
            lesson={currentLesson}
            onUpdate={setCurrentLesson}
          />
        )}

        {mode === 'preview' && (
          <LessonViewer
            lesson={currentLesson}
            onComplete={(result) => {
              console.log('Lektion abgeschlossen:', result);
            }}
          />
        )}

        {mode === 'record' && (
          <AudioRecorder
            lesson={currentLesson}
            onUpdate={setCurrentLesson}
          />
        )}
      </main>
    </div>
  );
}