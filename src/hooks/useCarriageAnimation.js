import { useEffect, useRef, useLayoutEffect } from "react";

export default function useCarriageAnimation({
  text,
  offsetRefs,
  setCarriageOffset,
  editorRef,
}) {

  const {
    carriageOffset,
    paperOffset,
    maxCarriageOffset,
    maxPaperOffset,
  } = offsetRefs;
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
    const maxOffset = maxCarriageOffset.current;
    const offset = maxOffset - caretPos;
  
    //console.log("CaretPos:", caretPos, "MaxOffset:", maxOffset, "Offset:", offset);
    return offset;
  }

  useEffect(() => {
    if (!editor) return;

    carriageOffset.current = calculateCarriageOffset();
    setCarriageOffset(carriageOffset.current);

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

    maxCarriageOffset.current = targetLeft - editorLeft;
  }, []);
}
