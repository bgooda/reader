import '../../index.css';
import React from 'react';

interface TextLayerProps {
  text: string;
  onWordClick: (word: string, event: React.MouseEvent<HTMLSpanElement>) => void;
  onTextSelection: () => void;
}

export const TextLayer: React.FC<TextLayerProps> = ({ text, onWordClick, onTextSelection }) => (
  <div
    onMouseUp={onTextSelection}
    className="prose max-w-none"
  >
    {text.split('\n').filter(Boolean).map((paragraph, pIndex) => (
      <p key={pIndex} className="mb-4 leading-[3rem]">
        {paragraph.split(' ').map((word, wIndex) => (
          <span
            key={`${pIndex}-${wIndex}`}
            className="hover:bg-indigo-100 cursor-pointer transition-colors duration-200 px-0.5 rounded"
            onClick={(e) => onWordClick(word, e)}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    ))}
  </div>
);