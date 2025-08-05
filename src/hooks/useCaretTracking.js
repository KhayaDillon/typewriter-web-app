import { useState } from "react";

export default function useCaretTracking(editorRef, textLength) {
  const [caretIndex, setCaretIndex] = useState(0);

  const setCaretManually = () => {
    const editor = editorRef.current;
    if (!editor || caretIndex > textLength) return;

    const selection = window.getSelection();
    const range = document.createRange();

    const span = editor.querySelector(`[data-index='${caretIndex}']`);
    if (span) {
      range.setStart(span, 0);
    } else {
      const last = editor.lastChild;
      if (last) range.setStartAfter(last);
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const moveCaretHorizontal = (direction) => {
    setCaretIndex((i) => {
      if (direction === "left") return Math.max(0, i - 1);
      if (direction === "right") return Math.min(textLength, i + 1);
      return i;
    });
  };

  const moveCaretVertical = (direction) => {
  const editor = editorRef.current;
  if (!editor) return;

  const spans = [...editor.querySelectorAll("span[data-index]")];
  if (spans.length === 0) return;

  const currentSpan = spans[caretIndex];
  if (!currentSpan) return;

  const currentRect = currentSpan.getBoundingClientRect();
  const targetY =
    direction === "up"
      ? currentRect.top - currentRect.height / 2
      : currentRect.bottom + currentRect.height / 2;

  const caretX = currentRect.left + currentRect.width / 2;

  // Find the span closest to (caretX, targetY)
  let closestSpan = null;
  let closestDistance = Infinity;

  for (const span of spans) {
    const rect = span.getBoundingClientRect();
    const spanYCenter = rect.top + rect.height / 2;

    // Check if span is on the target line (within threshold)
    const isOnTargetLine =
      direction === "up"
        ? spanYCenter < currentRect.top
        : spanYCenter > currentRect.bottom;

    if (!isOnTargetLine) continue;

    const spanXCenter = rect.left + rect.width / 2;
    const distance = Math.abs(spanXCenter - caretX);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestSpan = span;
    }
  }

  if (closestSpan) {
    const newIndex = Number(closestSpan.dataset.index);
    setCaretIndex(newIndex);
  }
};

  return { caretIndex, setCaretIndex, setCaretManually, moveCaretHorizontal, moveCaretVertical };
}
