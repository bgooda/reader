import '../../index.css';
import React from 'react';
import { ReaderTranslation } from '../../types';
import { Translation } from './Translation';

interface TranslationLayerProps {
  translations: ReaderTranslation[];
}

export const TranslationLayer: React.FC<TranslationLayerProps> = ({ translations }) => (
  <div className="absolute inset-0 pointer-events-none translation-container">
    {translations.map((translation, index) => {
      console.log('Rendering Translation:', translation);
      return (
        translation.position.isMultiLine && translation.position.lineRects ? (
          translation.position.lineRects.map((lineRect, lineIndex) => (
            <Translation
              key={`${index}-${lineIndex}`}
              text={translation.text.split(' ')[lineIndex] || ''}
              position={{
                ...lineRect,
                isMultiLine: false,
              }}
            />
          ))
        ) : (
          <Translation
            key={index}
            text={translation.text}
            position={translation.position}
          />
        )
      );
    })}
  </div>
);