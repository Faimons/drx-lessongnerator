import React from 'react';
import IntroSlide from './IntroSlide';
import ConceptSlide from './ConceptSlide';
import ImportanceSlide from './ImportanceSlide';

export default function SlideRenderer({ slide, slideIndex, totalSlides }) {
  const renderSlide = () => {
    switch (slide.type) {
      case 'intro':
        return <IntroSlide slide={slide} />;
      case 'concept':
        return <ConceptSlide slide={slide} />;
      case 'importance':
        return <ImportanceSlide slide={slide} />;
      default:
        return (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Unbekannter Slide-Typ: {slide.type}</h2>
            <p className="text-gray-300">{slide.title}</p>
          </div>
        );
    }
  };

  return (
    <div className="slide-container animate-fade-in">
      {renderSlide()}
    </div>
  );
}