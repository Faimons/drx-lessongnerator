import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';

export default function IntroSlide({ slide }) {
  return (
    <div className="text-center space-y-8 animate-slide-up">
      {/* Haupttitel */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <h2 className="text-2xl md:text-3xl text-blue-300 font-semibold">
            {slide.subtitle}
          </h2>
        )}
      </div>

      {/* Lernziele */}
      {slide.content?.objectives && (
        <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-8 h-8 text-green-400" />
            <h3 className="text-2xl font-bold text-green-400">
              Was Sie in dieser Lektion lernen
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slide.content.objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                    {index + 1}
                  </div>
                  <p className="text-green-100 text-lg leading-relaxed">
                    {objective}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnung/Hinweis */}
      {slide.content?.warning && (
        <div className="glass-effect rounded-2xl p-6 max-w-3xl mx-auto bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h4 className="text-xl font-bold text-yellow-400">Wichtiger Hinweis</h4>
          </div>
          <p className="text-yellow-100 text-lg leading-relaxed">
            {slide.content.warning}
          </p>
        </div>
      )}

      {/* Bereit-Indikator */}
      <div className="mt-12">
        <div className="inline-flex items-center gap-2 text-blue-300">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-lg font-semibold">Bereit? Lassen Sie uns beginnen!</span>
        </div>
      </div>
    </div>
  );
}