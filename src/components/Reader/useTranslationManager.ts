import { useRef, useCallback } from 'react';
import { ReaderTranslation, Language } from '../../types';
import { getTranslation } from '../../utils/mockTranslation';
import { calculateTranslationPosition } from '../../utils/translationPosition';
import { findConnectedSequence } from '../../utils/wordSelection';

interface UseTranslationManagerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  translations: ReaderTranslation[];
  setTranslations: React.Dispatch<React.SetStateAction<ReaderTranslation[]>>;
  language: Language;
}

export const useTranslationManager = ({
  containerRef,
  translations,
  setTranslations,
  language
}: UseTranslationManagerProps) => {
  const lastClickedElement = useRef<HTMLElement | null>(null);

  const removeTranslations = useCallback((elements: HTMLElement[]) => {
    const overlappingTranslations = translations.filter(t => 
      t.elements.some(el => elements.includes(el))
    );
    
    overlappingTranslations.forEach(t => {
      t.elements.forEach(el => {
        el.className = 'hover:bg-indigo-100 cursor-pointer transition-colors duration-200 px-0.5 rounded';
      });
    });
    
    setTranslations(translations.filter(t => !overlappingTranslations.includes(t)));
  }, [translations, setTranslations]);

  const addTranslation = useCallback((text: string, elements: HTMLElement[]) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const position = calculateTranslationPosition(elements, containerRect);
    const originalText = text.trim();
    let errorTimeout: NodeJS.Timeout;
    
    elements.forEach(el => {
      el.className = 'border-b-2 border-indigo-500 hover:bg-indigo-100 cursor-pointer transition-colors duration-200 px-0.5 rounded opacity-50';
    });

    getTranslation(originalText, language).then(translation => {
      if (errorTimeout) clearTimeout(errorTimeout);
      elements.forEach(el => {
        el.className = 'border-b-2 border-indigo-500 hover:bg-indigo-100 cursor-pointer transition-colors duration-200 px-0.5 rounded';
      });
      
      setTranslations(prev => [...prev, {
        text: translation,
        position,
        elements,
        originalText,
      }]);
    }).catch((error) => {
      console.error('Translation failed:', error);
      elements.forEach(el => {
        el.className = 'border-b-2 border-red-500 hover:bg-red-100 cursor-pointer transition-colors duration-200 px-0.5 rounded';
      });
      
      // Reset error styling after 2 seconds
      errorTimeout = setTimeout(() => {
        elements.forEach(el => {
          el.className = 'hover:bg-indigo-100 cursor-pointer transition-colors duration-200 px-0.5 rounded';
        });
      }, 2000);
    });
  }, [containerRef, setTranslations]);

  const handleWordClick = useCallback((word: string, event: React.MouseEvent<HTMLSpanElement>) => {
    const target = event.currentTarget;

    // Check if clicking on an already selected word/phrase
    const existingTranslation = translations.find(t => 
      t.elements.includes(target)
    );

    if (existingTranslation) {
      removeTranslations(existingTranslation.elements);
      lastClickedElement.current = null;
      return;
    }

    // Find potential sequence with last clicked element
    if (lastClickedElement.current) {
      const sequence = findConnectedSequence(lastClickedElement.current, target, translations);
      
      if (sequence.length > 0) {
        // Remove any existing translations that overlap with our new sequence
        removeTranslations(sequence);
        
        // Create the new translation for the entire sequence
        const text = sequence.map(el => el.textContent?.trim()).join(' ');
        addTranslation(text, sequence);
        lastClickedElement.current = target;
        return;
      }
    }

    // Single word click
    removeTranslations([target]);
    addTranslation(word, [target]);
    lastClickedElement.current = target;
  }, [translations, removeTranslations, addTranslation]);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !containerRef.current) return;
    
    const range = selection.getRangeAt(0);
    const text = range.toString().trim();
    
    if (!text || text.split(/\s+/).length > 12) {
      selection.removeAllRanges();
      return;
    }

    // Find all span elements within the selection
    const spans = Array.from(containerRef.current.getElementsByTagName('span'))
      .filter(span => range.intersectsNode(span));
    
    if (spans.length > 0) {
      removeTranslations(spans);
      const text = spans.map(el => el.textContent?.trim()).join(' ');
      if (text) {
        addTranslation(text, spans);
        lastClickedElement.current = spans[spans.length - 1];
      }
    }
    
    selection.removeAllRanges();
  }, [containerRef, removeTranslations, addTranslation]);

  return {
    handleWordClick,
    handleTextSelection
  };
};