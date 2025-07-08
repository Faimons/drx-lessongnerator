import React, { useState } from 'react';
import { Lightbulb, Eye, TrendingUp, BarChart3 } from 'lucide-react';

export default function ConceptSlide({ slide }) {
  const [showExamples, setShowExamples] = useState(false);

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
        <div className="flex items-start gap-4 mb-6">
          <Lightbulb className="w-8 h-8 text-yellow-400 mt-1" />
          <h3 className="text-2xl font-bold text-white">Konzept verstehen</h3>
        </div>
        <p className="text-xl leading-relaxed text-gray-200">
          {slide.content?.explanation}
        </p>
      </div>

      {/* Beispiele (wenn vorhanden) */}
      {slide.content?.examples && (
        <div className="space-y-6">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            {showExamples ? 'Beispiele ausblenden' : 'Praktische Beispiele anzeigen'}
          </button>

          {showExamples && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              {/* Beispiel ohne Chart */}
              {slide.content.examples.withoutChart && (
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    {slide.content.examples.withoutChart.title}
                  </h4>
                  
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-2 mb-4">
                    {slide.content.examples.withoutChart.data?.map((entry, index) => (
                      <div key={index} className="text-green-400">{entry}</div>
                    ))}
                  </div>
                  
                  <p className="text-red-300 text-lg">
                    {slide.content.examples.withoutChart.question}
                  </p>
                </div>
              )}

              {/* Beispiel mit Chart */}
              {slide.content.examples.withChart && (
                <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    {slide.content.examples.withChart.title}
                  </h4>
                  
                  {/* Einfacher Chart */}
                  <div className="bg-black/50 rounded-lg p-4 h-48 relative mb-4">
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Gitterlinien */}
                      <g stroke="#374151" strokeWidth="1" opacity="0.3">
                        <line x1="0" y1="40" x2="100%" y2="40" />
                        <line x1="0" y1="80" x2="100%" y2="80" />
                        <line x1="0" y1="120" x2="100%" y2="120" />
                        <line x1="0" y1="160" x2="100%" y2="160" />
                      </g>
                      
                      {/* Chart-Linie */}
                      <polyline
                        points="20,120 60,110 100,130 140,90 180,100 220,140 260,80 300,95"
                        fill="url(#chartGradient)"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Datenpunkte */}
                      {[
                        {x: 20, y: 120}, {x: 60, y: 110}, {x: 100, y: 130}, 
                        {x: 140, y: 90}, {x: 180, y: 100}, {x: 220, y: 140}, 
                        {x: 260, y: 80}, {x: 300, y: 95}
                      ].map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill="#fbbf24"
                          stroke="#fff"
                          strokeWidth="2"
                          className="drop-shadow-lg"
                        />
                      ))}
                    </svg>
                  </div>
                  
                  <p className="text-green-300 text-lg">
                    {slide.content.examples.withChart.conclusion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Wichtiger Punkt */}
      {slide.content?.keyPoint && (
        <div className="glass-effect rounded-2xl p-6 bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">!</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-blue-400 mb-2">Schlüsselerkenntnis</h4>
              <p className="text-blue-100 text-lg leading-relaxed">
                {slide.content.keyPoint}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}