import { useEffect, useRef, useLayoutEffect } from "react";

export default function usePaperAnimation({
  text,
  offsetRefs,
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
  const {
    carriageOffset,
    paperOffset,
    maxCarriageOffset,
    maxPaperOffset,
  } = offsetRefs;
  const editor = editorRef.current;
  const lastTop = prevTop.current;
  

  function getCaretPixelPosition() {
    if (!editor) return 0;
  
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


  const detectLineChange = () => {
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
    if (!editor) return;
    
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

  useLayoutEffect(() => {
    const target = document.querySelector("#type-lever-target");
    const editor = editorRef.current;

    if (!target || !editor) return;

    const raf = requestAnimationFrame(() => {
      const targetTop = target.getBoundingClientRect().top;
      const editorTop = editor.getBoundingClientRect().top;
      const measuredOffset = targetTop - editorTop;

      // Avoid overriding if measured offset is suspiciously small
      if (measuredOffset > 100) {
        maxPaperOffset.current = measuredOffset;
        setPaperOffset(measuredOffset);
        console.log("✅ MaxPaperOffset initialized to", measuredOffset);
      } else {
        console.warn("⚠️ Skipped maxPaperOffset update: measured value looked off", measuredOffset);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [setPaperOffset, editorRef]);
}
