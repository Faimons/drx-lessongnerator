// src/components/ScriptEditor.jsx
import React, { useState } from 'react';
import { Save, Plus, Trash2, Copy, Settings, Clock, Type, Mic } from 'lucide-react';

export default function ScriptEditor({ lesson, onUpdate }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const updateSlide = (slideIndex, field, value) => {
    const newLesson = { ...lesson };
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newLesson.slides[slideIndex][parent] = {
        ...newLesson.slides[slideIndex][parent],
        [child]: value
      };
    } else {
      newLesson.slides[slideIndex][field] = value;
    }
    onUpdate(newLesson);
  };

  const updateBulletPoint = (slideIndex, pointIndex, value) => {
    const newLesson = { ...lesson };
    newLesson.slides[slideIndex].content.bulletPoints[pointIndex] = value;
    onUpdate(newLesson);
  };

  const addSlide = () => {
    const newSlide = {
      id: lesson.slides.length + 1,
      title: `Slide ${lesson.slides.length + 1}`,
      type: 'content',
      duration: 30000,
      audioScript: `Sprechtext für Slide ${lesson.slides.length + 1}`,
      content: {
        headline: `Überschrift ${lesson.slides.length + 1}`,
        text: 'Hauptinhalt für diese Slide',
        bulletPoints: ['Punkt 1', 'Punkt 2', 'Punkt 3'],
        image: null,
        callToAction: null
      }
    };

    const newLesson = {
      ...lesson,
      slides: [...lesson.slides, newSlide],
      totalSlides: lesson.slides.length + 1
    };
    onUpdate(newLesson);
  };

  const deleteSlide = (index) => {
    if (lesson.slides.length <= 5) {
      alert('Minimum 5 Slides erforderlich');
      return;
    }
    
    const newLesson = {
      ...lesson,
      slides: lesson.slides.filter((_, i) => i !== index),
      totalSlides: lesson.slides.length - 1
    };
    onUpdate(newLesson);
    setActiveSlide(Math.max(0, activeSlide - 1));
  };

  const duplicateSlide = (index) => {
    const slideToClone = { ...lesson.slides[index] };
    slideToClone.id = lesson.slides.length + 1;
    slideToClone.title += ' (Kopie)';

    const newLesson = {
      ...lesson,
      slides: [...lesson.slides.slice(0, index + 1), slideToClone, ...lesson.slides.slice(index + 1)],
      totalSlides: lesson.slides.length + 1
    };
    onUpdate(newLesson);
  };

  const generateAudioScript = (slideIndex) => {
    const slide = lesson.slides[slideIndex];
    const generatedScript = `${slide.content.headline}. ${slide.content.text} ${slide.content.bulletPoints.join('. ')}.`;
    updateSlide(slideIndex, 'audioScript', generatedScript);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Slide Navigation */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Slides</h3>
            <button
              onClick={addSlide}
              className="bg-green-600 hover:bg-green-700 p-2 rounded-lg"
              title="Neue Slide"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {lesson.slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  activeSlide === index
                    ? 'bg-blue-600/50 border-blue-400'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
                onClick={() => setActiveSlide(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{slide.title}</p>
                    <p className="text-xs text-gray-300">{slide.type}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(index);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Duplizieren"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(index);
                      }}
                      className="p-1 hover:bg-red-500/50 rounded"
                      title="Löschen"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Settings */}
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Einstellungen</h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {showSettings && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-blue-300">Auto-Play Geschwindigkeit (Sek)</label>
                <input
                  type="number"
                  value={lesson.settings.autoPlaySpeed / 1000}
                  onChange={(e) => onUpdate({
                    ...lesson,
                    settings: { ...lesson.settings, autoPlaySpeed: e.target.value * 1000 }
                  })}
                  className="w-full bg-gray-800 text-white p-2 rounded mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm text-blue-300">Audio Geschwindigkeit</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={lesson.settings.audioSpeed}
                  onChange={(e) => onUpdate({
                    ...lesson,
                    settings: { ...lesson.settings, audioSpeed: parseFloat(e.target.value) }
                  })}
                  className="w-full mt-1"
                />
                <span className="text-xs text-gray-300">{lesson.settings.audioSpeed}x</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide Editor */}
      <div className="lg:col-span-3">
        {lesson.slides[activeSlide] && (
          <div className="glass-effect rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Slide {activeSlide + 1} bearbeiten
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => generateAudioScript(activeSlide)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  title="Audio-Script generieren"
                >
                  <Mic className="w-4 h-4" />
                  Auto-Script
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-blue-300 font-semibold block mb-2">
                  <Type className="w-4 h-4 inline mr-2" />
                  Slide Titel
                </label>
                <input
                  type="text"
                  value={lesson.slides[activeSlide].title}
                  onChange={(e) => updateSlide(activeSlide, 'title', e.target.value)}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-300 font-semibold block mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Anzeigedauer (Sekunden)
                </label>
                <input
                  type="number"
                  value={lesson.slides[activeSlide].duration / 1000}
                  onChange={(e) => updateSlide(activeSlide, 'duration', e.target.value * 1000)}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Slide Type */}
            <div>
              <label className="text-blue-300 font-semibold block mb-2">Slide Typ</label>
              <select
                value={lesson.slides[activeSlide].type}
                onChange={(e) => updateSlide(activeSlide, 'type', e.target.value)}
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500"
              >
                <option value="intro">Intro</option>
                <option value="content">Inhalt</option>
                <option value="concept">Konzept</option>
                <option value="importance">Wichtigkeit</option>
                <option value="conclusion">Fazit</option>
              </select>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <label className="text-blue-300 font-semibold block mb-2">Hauptüberschrift</label>
                <input
                  type="text"
                  value={lesson.slides[activeSlide].content.headline}
                  onChange={(e) => updateSlide(activeSlide, 'content.headline', e.target.value)}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-300 font-semibold block mb-2">Haupttext</label>
                <textarea
                  value={lesson.slides[activeSlide].content.text}
                  onChange={(e) => updateSlide(activeSlide, 'content.text', e.target.value)}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 h-24"
                  placeholder="Beschreiben Sie den Hauptinhalt dieser Slide..."
                />
              </div>

              {/* Bullet Points */}
              <div>
                <label className="text-blue-300 font-semibold block mb-2">Bullet Points</label>
                <div className="space-y-2">
                  {lesson.slides[activeSlide].content.bulletPoints.map((point, index) => (
                    <input
                      key={index}
                      type="text"
                      value={point}
                      onChange={(e) => updateBulletPoint(activeSlide, index, e.target.value)}
                      className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-blue-500"
                      placeholder={`Punkt ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Audio Script */}
              <div>
                <label className="text-blue-300 font-semibold block mb-2">Audio Script</label>
                <textarea
                  value={lesson.slides[activeSlide].audioScript}
                  onChange={(e) => updateSlide(activeSlide, 'audioScript', e.target.value)}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 h-32"
                  placeholder="Der Text, der gesprochen werden soll..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Wörter: {lesson.slides[activeSlide].audioScript.split(' ').length} | 
                  Geschätzte Sprechzeit: {Math.ceil(lesson.slides[activeSlide].audioScript.split(' ').length / 2.5)} Sekunden
                </p>
              </div>

              {/* Call to Action (nur für letzte Slides) */}
              {(activeSlide >= lesson.slides.length - 3) && (
                <div>
                  <label className="text-blue-300 font-semibold block mb-2">Call to Action</label>
                  <input
                    type="text"
                    value={lesson.slides[activeSlide].content.callToAction || ''}
                    onChange={(e) => updateSlide(activeSlide, 'content.callToAction', e.target.value)}
                    className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500"
                    placeholder="z.B. 'Jetzt anwenden!' oder 'Starten Sie heute!'"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}