import { ReaderTranslation } from '../types';

export const findConnectedSequence = (
  elem1: HTMLElement,
  elem2: HTMLElement,
  translations: ReaderTranslation[]
): HTMLElement[] => {
  // Get all span elements in the paragraph
  const paragraph = elem1.closest('p');
  if (!paragraph || elem1.closest('p') !== elem2.closest('p')) return [];

  const spans = Array.from(paragraph.getElementsByTagName('span'));
  const existingSequences = translations.map(t => t.elements);
  
  // Find indices of our elements
  const index1 = spans.indexOf(elem1);
  const index2 = spans.indexOf(elem2);
  
  if (index1 === -1 || index2 === -1) return [];
  
  // Check if there's an existing sequence that connects these elements
  for (const sequence of existingSequences) {
    const seqSpans = sequence.filter(el => spans.includes(el));
    const seqIndices = seqSpans.map(el => spans.indexOf(el));
    const minSeqIndex = Math.min(...seqIndices);
    const maxSeqIndex = Math.max(...seqIndices);
    
    // If either element is adjacent to the sequence, extend it
    if ((index1 === minSeqIndex - 1 || index1 === maxSeqIndex + 1) ||
        (index2 === minSeqIndex - 1 || index2 === maxSeqIndex + 1)) {
      const newStart = Math.min(minSeqIndex, index1, index2);
      const newEnd = Math.max(maxSeqIndex, index1, index2);
      if (newEnd - newStart + 1 <= 12) {
        return spans.slice(newStart, newEnd + 1);
      }
    }
  }
  
  // If elements are adjacent or connected by an existing translation
  const start = Math.min(index1, index2);
  const end = Math.max(index1, index2);
  const between = spans.slice(start + 1, end);
  
  // Check if all elements between are part of existing translations
  if (between.every(el => 
    translations.some(t => t.elements.includes(el))
  )) {
    return spans.slice(start, end + 1);
  }
  
  // If elements are directly adjacent
  if (Math.abs(index1 - index2) === 1) {
    return [elem1, elem2];
  }
  
  return [];
};