import { useEffect, useRef } from "react";

const MIN_CHARS_BEFORE_WRAP = 70;

export default function TypewriterEffect({
  text,
  setCarriageOffset,
  setPaperOffset,
  editorRef,
}) {
  const offset = useRef(0);
  const prevLength = useRef(0);
  const prevText = useRef("");
  const prevTop = useRef(null);
  const logicalLineCount = useRef(1);
  const prevNewlineCount = useRef(0);
  const justWrapped = useRef(false);
  const didMount = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const spans = editor.querySelectorAll("span[data-index]");
    const lastSpan = spans[spans.length - 1];
    const editorTop = editor.getBoundingClientRect().top;
    const currentTop = lastSpan ? lastSpan.getBoundingClientRect().top - editorTop : null;
    const lastTop = prevTop.current;

    let lineChanged = false;

    if (!didMount.current) {
      prevTop.current = currentTop;
      prevLength.current = text.length;
      prevText.current = text;
      didMount.current = true;
      return;
    }

    const lengthDiff = text.length - prevLength.current;
    const currentNewlineCount = (text.match(/\n/g) || []).length;

    if (
      currentTop !== null &&
      lastTop !== null &&
      Math.abs(currentTop - lastTop) > 5
    ) {
      lineChanged = true;
    }

    const isNewLineAdded =
      text.length > prevText.current.length &&
      text[text.length - 1] === "\n";

    const isNewLineRemoved =
      text.length < prevText.current.length &&
      prevText.current.endsWith("\n") &&
      !text.endsWith("\n");

    // Log visual line info
    console.log(
      `Top: ${currentTop} | PrevTop: ${lastTop} | Visual Line Changed: ${lineChanged} | Manual Newlines: ${currentNewlineCount} | Estimated Total Lines: ${
        logicalLineCount.current + (lineChanged ? 1 : 0) + currentNewlineCount
      }`
    );

    // Autowrap
    if (lineChanged && prevLength.current > MIN_CHARS_BEFORE_WRAP) {
      justWrapped.current = true;
      offset.current = 0;
      setCarriageOffset(0);
      setPaperOffset(prev => prev + 20);
      logicalLineCount.current += 1;
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
        void editor.offsetWidth;
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
      setPaperOffset(prev => prev + 20);
      logicalLineCount.current += 1;
    }

    // Removed newline
    if (isNewLineRemoved || currentNewlineCount < prevNewlineCount.current) {
      setPaperOffset(prev => Math.max(0, prev - 30));
      logicalLineCount.current = Math.max(1, logicalLineCount.current - 1);
    }

    // Save state
    prevTop.current = currentTop;
    prevLength.current = text.length;
    prevText.current = text;
    prevNewlineCount.current = currentNewlineCount;
  }, [text, editorRef, setCarriageOffset, setPaperOffset]);

  return null;
}
