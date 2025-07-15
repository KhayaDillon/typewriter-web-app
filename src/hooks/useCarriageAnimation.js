import { useEffect, useRef, useLayoutEffect } from "react";

export default function useCarriageAnimation({
  text,
  offsetRef,
  maxOffsetRef,
  setCarriageOffset,
  editorRef,
}) {

  const editor = editorRef.current;

  function getCaretPixelPosition() {
    if (!editor) return 0;
  
    const editorRect = editor.getBoundingClientRect();
    const caretSpan = editor.querySelector(`[class=" animated-char"]`);

    if (!caretSpan) return 0; // caret at the end or not rendered yet
    
    const caretRect = caretSpan.getBoundingClientRect();
  
    return caretRect.left - editorRect.left;
  }

  function calculateCarriageOffset() {
    const caretPos = getCaretPixelPosition();
    const maxOffset = maxOffsetRef.current;
    const offset = maxOffset - caretPos;
  
    console.log("CaretPos:", caretPos, "MaxOffset:", maxOffset, "Offset:", offset);
    return offset;
  }

  useEffect(() => {
    if (!editor) return;

    offsetRef.current = calculateCarriageOffset();
    setCarriageOffset(offsetRef.current);

    // Trigger stamp animation
    editor.classList.remove("stamp-effect");
    void editor.offsetWidth; // Forces a reflow
    editor.classList.add("stamp-effect");

  }, [text, editorRef, setCarriageOffset]);

  useLayoutEffect(() => {
    const target = document.querySelector("#type-lever-target");
    if (!target || !editor) return;
  
    const targetLeft = target.getBoundingClientRect().left;
    const editorLeft = editor.getBoundingClientRect().left;
  
    maxOffsetRef.current = targetLeft - editorLeft;
  
    console.log("Initial maxOffset calculated:", maxOffsetRef.current);
  }, []);
}
