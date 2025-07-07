import React from 'react';
import '../styles/BrushStroke.css';
import brush from '../assets/brush1.svg';

export default function BrushStroke() {
  return (
    <img src={brush} alt="decorative brush stroke" className="brush-stroke" />
  );
}
