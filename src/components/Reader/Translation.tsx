import '../../index.css';
import React from 'react';
import { TranslationPosition } from '../../types';

interface TranslationProps {
  text: string;
  position: TranslationPosition;
}

export const Translation: React.FC<TranslationProps> = ({ text, position }) => {
  const style: React.CSSProperties = {
    top: `${position.top}px`,
    left: `${position.left}px`,
    width: `${position.width}px`,
  };

  return (
    <div className="translation" style={style}>
      {text}
    </div>
  );
};