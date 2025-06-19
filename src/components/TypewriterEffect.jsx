import { useEffect, useRef } from "react";

export default function TypewriterEffect({
  text,
  setCarriageOffset,
  setPaperOffset,
  editorRef, // now points to the contentEditable div
}) {
  const offset = useRef(0);
  const prevLength = useRef(0);
  const prevText = useRef("");
  const prevLines = useRef(1);
  const prevNewlineCount = useRef(0);
  const justWrapped = useRef(false);
  const didMount = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const lineHeight = 16 * 1.5; // sync with CSS

    if (!didMount.current) {
      const initialLineCount = Math.ceil(editor.offsetHeight / lineHeight);
      prevLines.current = initialLineCount;
      prevLength.current = text.length;
      prevText.current = text;
      didMount.current = true;
      return;
    }

    const lengthDiff = text.length - prevLength.current;
    
    const isNewLineAdded =
      text.length > prevText.current.length &&
      text[text.length - 1] === "\n";

    const isNewLineRemoved =
      text.length < prevText.current.length &&
      prevText.current.endsWith("\n") &&
      !text.endsWith("\n");

    const getLineCount = (container) => {
      const range = document.createRange();
      const lines = new Set();
    
      container.childNodes.forEach((node) => {
        if (node.nodeType === 1 || node.nodeType === 3) {
          range.selectNodeContents(node);
          const rects = range.getClientRects();
          for (let rect of rects) {
            lines.add(rect.top); // each distinct `top` value = a new line
          }
        }
      });
    
      return lines.size;
    };

    const currentLineCount = getLineCount(editor);
    const currentNewlineCount = (text.match(/\n/g) || []).length;
    console.log("Height:", editor.offsetHeight, "Lines:", currentLineCount);


    // Autowrap detection
    if (currentLineCount > prevLines.current && prevLength.current > 0) {
      justWrapped.current = true;
      offset.current = 0;
      setCarriageOffset(0);
      setPaperOffset((prev) => prev + 20);
    }

    // Typing (not due to wrapping)
    if (lengthDiff > 0) {
      if (justWrapped.current) {
        justWrapped.current = false;
      } else {
        offset.current = Math.min(500, offset.current + 5);
        setCarriageOffset(offset.current);

        // Trigger stamp animation
        editor.classList.remove("stamp-effect");
        void editor.offsetWidth; // force reflow
        editor.classList.add("stamp-effect");
      }
    }

    // Backspace
    if (lengthDiff < 0) {
      offset.current = Math.max(0, offset.current - 5);
      setCarriageOffset(offset.current);
    }

    // Manual newline (Enter)
    if (isNewLineAdded && !justWrapped.current) {
      offset.current = 0;
      setCarriageOffset(0);
      setPaperOffset((prev) => prev + 20);
    }

    // Removed newline
    if (isNewLineRemoved || currentNewlineCount < prevNewlineCount.current) {
      setPaperOffset((prev) => Math.max(0, prev - 30));
    }

    // Save state
    prevNewlineCount.current = currentNewlineCount;
    prevLines.current = currentLineCount;
    prevLength.current = text.length;
    prevText.current = text;
  }, [text, editorRef, setCarriageOffset, setPaperOffset]);

  return null;
}
