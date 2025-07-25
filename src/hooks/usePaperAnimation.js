import { useEffect, useRef } from "react";

export default function usePaperAnimation({
  text,
  offsetRefs,
  setCarriageOffset, 
  setPaperOffset,
  editorRef,
  onLayoutReady,
  playReturnSound, 
}) {
  const prevText = useRef("");
  const prevTop = useRef(null);
  const logicalLineCount = useRef(1);
  const prevNewlineCount = useRef(0);
  const {
    carriageOffset,
    paperOffset,
    maxCarriageOffset,
    maxPaperOffset,
  } = offsetRefs;
  const editor = editorRef.current;
  const lastTop = prevTop.current;
  
  function getCaretPixelPosition() {
    const editorRect = editor.getBoundingClientRect();
    const caretSpan = editor.querySelector(`[class=" animated-char"]`);

    if (!caretSpan) return 0; // caret at the end or not rendered yet
    
    const caretRect = caretSpan.getBoundingClientRect();

    console.log("CaretRect:", caretRect.top, "EditorRect:", editorRect.top);
    return caretRect.top - editorRect.top;
  }

  function calculatePaperOffset() {
    const caretPos = getCaretPixelPosition();
    const maxOffset = maxPaperOffset.current;
    const offset = maxOffset - caretPos;
  
    console.log("CaretPos:", caretPos, "MaxOffset:", maxOffset, "Offset:", offset);
    return offset;
  }

  const detectLineChange = (spans) => {
    const lastSpan = spans[spans.length - 1];
    const editorTop = editor.getBoundingClientRect().top;
    const currentTop = lastSpan ? lastSpan.getBoundingClientRect().top - editorTop : null;

    const lineChanged = currentTop !== null && lastTop !== null && Math.abs(currentTop - lastTop) > 5;

    console.log("DetectLineChange: lastTop =", lastTop, "currentTop =", currentTop, "lineChanged =", lineChanged, "textLength =", text.length);

    return { lineChanged, currentTop };
  };

  useEffect(() => {
    if (!onLayoutReady) return;
    if (!editor) return;

    const spans = editor.querySelectorAll("span[data-index]");
    const { lineChanged, currentTop } = detectLineChange(spans);
    const currentNewlineCount = (text.match(/\n/g) || []).length;

    const isNewLineRemoved =
      text.length < prevText.current.length &&
      prevText.current.endsWith("\n") &&
      !text.endsWith("\n");

    // Autowrap or New Line Added
    if (lineChanged) {
      carriageOffset.current = maxCarriageOffset.current;
      setCarriageOffset(carriageOffset.current);
      paperOffset.current = calculatePaperOffset()
      setPaperOffset(paperOffset.current);
      logicalLineCount.current += 1;
      playReturnSound();
    }

    // Removed newline
    if (isNewLineRemoved || currentNewlineCount < prevNewlineCount.current) {
      paperOffset.current = calculatePaperOffset()
      setPaperOffset(paperOffset.current);
      logicalLineCount.current = Math.max(1, logicalLineCount.current - 1);
    }

    // Save state
    prevTop.current = currentTop;
    prevText.current = text;
    prevNewlineCount.current = currentNewlineCount;
  }, [text, editorRef, setPaperOffset, setCarriageOffset]);

}
