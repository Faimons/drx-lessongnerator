import React from 'react';
import InteractiveLessonComponent from './components/InteractiveLessonComponent';

export default function App() {
  const handleLessonComplete = (result) => {
    console.log('Lektion abgeschlossen:', result);
    alert('Glückwunsch! Lektion abgeschlossen!');
  };

  const handleBack = () => {
    console.log('Zurück geklickt');
    // Hier könnten Sie zur Lesson-Auswahl zurückkehren
  };

  return (
    <div className="min-h-screen">
      <InteractiveLessonComponent
        onBack={handleBack}
        onComplete={handleLessonComplete}
      />
    </div>
  );
}