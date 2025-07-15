import { useEffect, useRef } from "react";

export default function usePaperAnimation({
  text,
  offsetRef,
  maxOffsetRef,
  setCarriageOffset, 
  setPaperOffset,
  editorRef,
  didMountRef,
  playReturnSound, 
}) {
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

    console.log("DetectLineChange: lastTop =", lastTop, "currentTop =", currentTop, "lineChanged =", lineChanged, "textLength =", text.length);

    return { lineChanged, currentTop };
  };

  useEffect(() => {
    if (!editorRef.current) return;
    
    if (!didMountRef.current) {
      prevTop.current = detectLineChange().currentTop;
      prevText.current = text;
      didMountRef.current = true;
      return;
    }

    const { lineChanged, currentTop } = detectLineChange();
    const currentNewlineCount = (text.match(/\n/g) || []).length;

    const isNewLineRemoved =
      text.length < prevText.current.length &&
      prevText.current.endsWith("\n") &&
      !text.endsWith("\n");

    // Autowrap or New Line Added
    if (lineChanged) {
      offsetRef.current = maxOffsetRef.current;
      setCarriageOffset(offsetRef.current);
      setPaperOffset(prev => prev + 20);
      logicalLineCount.current += 1;
      playReturnSound();
    }

    // Removed newline
    if (isNewLineRemoved || currentNewlineCount < prevNewlineCount.current) {
      setPaperOffset(prev => Math.max(0, prev - 30));
      logicalLineCount.current = Math.max(1, logicalLineCount.current - 1);
    }

    // Save state
    prevTop.current = currentTop;
    prevText.current = text;
    prevNewlineCount.current = currentNewlineCount;
  }, [text, editorRef, setPaperOffset, setCarriageOffset]);
}
