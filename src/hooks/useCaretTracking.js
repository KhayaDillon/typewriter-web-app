// useCaretTracking.js
import { useState, useEffect } from "react";

export default function useCaretTracking(editorRef, textLength) {
  const [caretIndex, setCaretIndex] = useState(0);

  // Compute caret index from the browser selection in a robust way
  const computeIndexFromSelection = () => {
    const editor = editorRef.current;
    const sel = window.getSelection();
    if (!editor || !sel || !sel.rangeCount) return null;

    const range = sel.getRangeAt(0);
    const sc = range.startContainer;
    const so = range.startOffset;

    // 1) If caret is directly on the editor element (between child nodes)
    if (sc === editor) {
      // startOffset is the index among editor.childNodes where the caret sits
      // That equals the insertion index (because each visible char is a span child)
      return Math.min(so, textLength);
    }

    // 2) If caret is inside a text node (most common: span > textNode)
    if (sc.nodeType === Node.TEXT_NODE) {
      const parent = sc.parentElement;
      const base = parent?.dataset?.index;
      if (base !== undefined) {
        const baseIndex = Number(base);
        // If offset is 0 => caret before the char => baseIndex
        // If offset > 0 => caret after (or inside) the char => baseIndex + offset
        // In your setup each span is one character, so offset will be 0 or 1 typically
        const index = baseIndex + (so > 0 ? so : 0);
        return Math.min(index, textLength);
      }
    }

    // 3) If caret is inside an element node (rare, but handle)
    if (sc.nodeType === Node.ELEMENT_NODE) {
      // If that element has a data-index, use it + offset
      if (sc.dataset && sc.dataset.index !== undefined) {
        return Math.min(Number(sc.dataset.index) + so, textLength);
      }

      // Fallback: map to editor.childNodes index
      const childIndex = Array.prototype.indexOf.call(editor.childNodes, sc);
      if (childIndex !== -1) {
        return Math.min(childIndex + so, textLength);
      }
    }

    // Otherwise give up (caller should fallback to internal caretIndex)
    return null;
  };

  const setCaretManually = () => {
    const editor = editorRef.current;
    if (!editor || caretIndex > textLength) return;

    const selection = window.getSelection();
    const range = document.createRange();

    const span = editor.querySelector(`[data-index='${caretIndex}']`);
    if (span) {
      // Put the DOM caret *before* that span (so typing inserts at caretIndex)
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

    // Find span closest to (caretX, targetY)
    let closestSpan = null;
    let closestDistance = Infinity;

    for (const span of spans) {
      const rect = span.getBoundingClientRect();
      const spanYCenter = rect.top + rect.height / 2;

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

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const updateCaretFromSelection = () => {
      const idx = computeIndexFromSelection();
      if (typeof idx === "number" && !isNaN(idx)) {
        setCaretIndex(Math.min(idx, textLength));
      }
    };

    // Listen to events that indicate the selection likely changed inside editor
    editor.addEventListener("mouseup", updateCaretFromSelection);
    editor.addEventListener("keyup", updateCaretFromSelection);
    // add selectionchange to catch keyboard navigation too
    document.addEventListener("selectionchange", updateCaretFromSelection);

    return () => {
      editor.removeEventListener("mouseup", updateCaretFromSelection);
      editor.removeEventListener("keyup", updateCaretFromSelection);
      document.removeEventListener("selectionchange", updateCaretFromSelection);
    };
  }, [editorRef, textLength]); // re-subscribe if editorRef / textLength changes

  return {
    caretIndex,
    setCaretIndex,
    setCaretManually,
    moveCaretHorizontal,
    moveCaretVertical,
    computeIndexFromSelection,
  };
}
