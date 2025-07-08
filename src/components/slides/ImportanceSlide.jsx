import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ImportanceSlide({ slide }) {
  return (
    <div className="space-y-8 animate-slide-up max-w-5xl mx-auto">
      {/* Titel */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
          {slide.title}
        </h2>
      </div>

      {/* Haupterklärung */}
      <div className="glass-effect rounded-2xl p-8">
        <p className="text-xl leading-relaxed text-gray-200 text-center">
          {slide.content?.explanation}
        </p>
      </div>

      {/* Vergleiche */}
      {slide.content?.comparisons && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {slide.content.comparisons.map((comparison, index) => {
            const isDangerous = comparison.status === 'dangerous';
            
            return (
              <div
                key={index}
                className={`rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                  isDangerous
                    ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30'
                    : 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  {isDangerous ? (
                    <XCircle className="w-8 h-8 text-red-400" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  )}
                  <h4 className={`text-lg font-bold ${
                    isDangerous ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {comparison.scenario}
                  </h4>
                </div>

                {/* Beschreibung */}
                <p className={`mb-6 text-lg leading-relaxed ${
                  isDangerous ? 'text-red-200' : 'text-green-200'
                }`}>
                  {comparison.description}
                </p>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
                  isDangerous
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  {isDangerous ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      Gefährlich und unprofessionell
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Informiert und professionell
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Warnung */}
      {slide.content?.warning && (
        <div className="glass-effect rounded-2xl p-6 bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mt-1" />
            <div>
              <h4 className="text-xl font-bold text-yellow-400 mb-2">
                Wichtige Warnung
              </h4>
              <p className="text-yellow-100 text-lg leading-relaxed">
                {slide.content.warning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}