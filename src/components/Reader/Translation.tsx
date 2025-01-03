import '../../index.css';
import React from 'react';
import { TranslationPosition } from '../../types';

interface TranslationProps {
  text: string;
  position: TranslationPosition;
}

export const Translation: React.FC<TranslationProps> = ({ text, position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    width: `${position.width}px`,
    padding: '4px 8px', // Add padding for better readability
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordBreak: 'break-word',
    maxWidth: '100%',
    fontSize: 'inherit',
    fontFamily: 'Handwriting',
    lineHeight: 'normal',
    background: 'rgba(255, 255, 255, 0.8)', // Optional: Add background to translations
    borderRadius: '4px', // Optional: Make it visually distinct
  };

  return (
    <div
      className="font-handwriting text-indigo-600 text-lg whitespace-pre-wrap"
      style={style}
    >
      {text}
    </div>
  );
};