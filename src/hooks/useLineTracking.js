import { useEffect, useRef } from "react";

const MIN_CHARS_BEFORE_WRAP = 60;

export default function useLineTracking({
  text,
  offsetRef,
  setPaperOffset,
  editorRef,
  justWrappedRef,
  didMountRef,
}) {
  const prevLength = useRef(0);
  const prevText = useRef("");
  const prevTop = useRef(null);
  const logicalLineCount = useRef(1);
  const prevNewlineCount = useRef(0);

  const lastTop = prevTop.current;

  const detectLineChange = () => {
    const editor = editorRef.current;
    if (!editor) return { lineChanged: false, currentTop: null };

    const spans = editor.querySelectorAll("span[data-index]");
    const lastSpan = spans[spans.length - 1];
    const editorTop = editor.getBoundingClientRect().top;
    const currentTop = lastSpan ? lastSpan.getBoundingClientRect().top - editorTop : null;

    const lineChanged = currentTop !== null && lastTop !== null && Math.abs(currentTop - lastTop) > 5;

    return { lineChanged, currentTop };
  };

  useEffect(() => {
    if (!editorRef.current) return;
    
    if (!didMountRef.current) {
      prevTop.current = detectLineChange().currentTop;
      prevLength.current = text.length;
      prevText.current = text;
      didMountRef.current = true;
      return;
    }

    const { lineChanged, currentTop } = detectLineChange();
    const currentNewlineCount = (text.match(/\n/g) || []).length;

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
      justWrappedRef.current = true;
      offsetRef.current = 0;
      setPaperOffset(prev => prev + 20);
      logicalLineCount.current += 1;
    }

    // Manual newline (Enter)
    if (isNewLineAdded && !justWrappedRef.current) {
      offsetRef.current = 0;
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
  }, [text, editorRef, setPaperOffset]);
}
