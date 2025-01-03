import '../../index.css';
import React, { useState, useRef } from 'react';
import { Language, ReaderTranslation } from '../../types';
import { TranslationLayer } from './TranslationLayer';
import { TextLayer } from './TextLayer';
import { useTranslationManager } from './useTranslationManager';

export const Reader: React.FC<{ text: string; language: Language }> = ({ text, language }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translations, setTranslations] = useState<ReaderTranslation[]>([]);
  const { handleWordClick, handleTextSelection } = useTranslationManager({
    containerRef,
    translations,
    setTranslations,
    language
  });

  return (
    <div 
      ref={containerRef}
      className="relative p-8 bg-[#f8f9fa] text-gray-800 rounded-lg shadow-sm"
      style={{ minHeight: '400px' }}
    >
      <TranslationLayer translations={translations} />
      <TextLayer 
        text={text}
        onWordClick={handleWordClick}
        onTextSelection={handleTextSelection}
      />
    </div>
  );
};