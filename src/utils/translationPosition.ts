import { TranslationPosition } from '../types';

export const calculateTranslationPosition = (
  elements: HTMLElement[],
  containerRect: DOMRect
): TranslationPosition => {
  const rects = elements.map((el) => el.getBoundingClientRect());

  const top = Math.max(
    Math.min(...rects.map((rect) => rect.top)) - containerRect.top - 24,
    0 // Prevent overflow above container
  );
  const left = Math.max(
    Math.min(...rects.map((rect) => rect.left)) - containerRect.left,
    0 // Prevent overflow on the left
  );
  const width = Math.min(
    Math.max(...rects.map((rect) => rect.right)) - Math.min(...rects.map((rect) => rect.left)),
    containerRect.width - left // Prevent overflow on the right
  );
  const height = rects.reduce((total, rect) => total + rect.height, 0);

  const lineRects = rects.map((rect) => {
    const lineLeft = Math.max(rect.left - containerRect.left, 0);
    const lineRight = Math.min(rect.right - containerRect.left, containerRect.width);
    const lineWidth = Math.max(lineRight - lineLeft, 0); // Ensure width is non-negative

    return {
      top: Math.max(rect.top - containerRect.top - 24, 0),
      left: lineLeft,
      width: lineWidth,
      height: rect.height,
    };
  });

  console.log('Translation Position Debug:', { top, left, width, height, lineRects });

  return {
    top,
    left,
    width,
    height,
    isMultiLine: rects.length > 1,
    lineRects,
  };
};