# ?? Trading Academy - Lesson Viewer

Ein interaktives React-System zum Anzeigen und Abspielen von Trading-Lektionen mit Audio-Support.

## ?? Features

- **Interaktive Slides**: Verschiedene Slide-Typen (Intro, Concept, Importance)
- **Audio-Narration**: Text-to-Speech Simulation mit visueller Hervorhebung
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Auto-Play Modus**: Automatisches Durchlaufen der Lektionen
- **Progress Tracking**: Fortschritts-Anzeige und Slide-Navigation
- **Glasmorphism Design**: Modernes UI mit Blur-Effekten

## ??? Installation

`ash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build
`

## ?? Projektstruktur

`
src/
+-- components/
¦   +-- slides/           # Slide-Komponenten
¦   +-- audio/           # Audio-Player
¦   +-- navigation/      # Navigation & Progress
¦   +-- ui/             # UI-Komponenten
+-- data/
¦   +-- lessons/        # Lesson-Daten
+-- hooks/              # Custom React Hooks
+-- utils/              # Helper-Funktionen
`

## ?? Verwendung

1. Server starten: 
pm run dev
2. Browser öffnen: http://localhost:5175
3. Lektion auswählen und starten
4. Navigation mit Pfeiltasten oder Buttons

## ?? Lesson-Format

Lektionen folgen diesem JSON-Format:

`json
{
  "id": 1,
  "title": "Lektion Titel",
  "description": "Beschreibung",
  "difficulty": "Beginner|Intermediate|Advanced",
  "slides": [
    {
      "id": 1,
      "title": "Slide Titel",
      "type": "intro|concept|importance",
      "audioScript": "Text für Audio-Narration",
      "content": {
        // Slide-spezifischer Content
      }
    }
  ]
}
`

## ?? Audio-System

Das Audio-System simuliert Text-to-Speech durch:
- Wort-für-Wort Hervorhebung
- Einstellbare Sprechgeschwindigkeit
- Progress-Tracking
- Play/Pause/Reset Kontrollen

## ?? Design-System

- **Tailwind CSS** für Styling
- **Glassmorphism** Effekte
- **Responsive** Grid-Layouts
- **Animations** für Übergänge
- **Dark Theme** optimiert

## ?? Browser-Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ?? Deployment

`ash
# Build für Production
npm run build

# Preview der Production-Version
npm run preview
`

## ?? Support

Bei Fragen oder Problemen, öffnen Sie ein Issue oder kontaktieren Sie das Entwicklungsteam.
