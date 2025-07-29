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

  const moveCaret = (direction) => {
    setCaretIndex((i) => {
      if (direction === "left") return Math.max(0, i - 1);
      if (direction === "right") return Math.min(textLength, i + 1);
      return i;
    });
  };

  return { caretIndex, setCaretIndex, setCaretManually, moveCaret };
}
