export type Language = 'es' | 'de' | 'fr';

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  language: Language;
  context: string;
  createdAt: string;
}

export interface TranslationResponse {
  translation: string;
}

export interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
}

export interface TranslationPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  isMultiLine: boolean;
  lineRects?: { top: number; left: number; width: number; height: number }[];
}

export interface ReaderTranslation {
  text: string;
  position: TranslationPosition;
  elements: HTMLElement[];
  originalText: string;
}