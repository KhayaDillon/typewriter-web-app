import { useEffect, useRef } from "react";

export default function useCarriageAnimation({
  text,
  offsetRefs,
  setCarriageOffset,
  editorRef,
  onLayoutReady,
}) {

  const {
    carriageOffset,
    maxCarriageOffset,
  } = offsetRefs;
  const editor = editorRef.current;

  function getCaretPixelPosition() {
    const editorRect = editor.getBoundingClientRect();
    const caretSpan = editor.querySelector(".carriage-target");

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
    if (!onLayoutReady) return;
    if (!editor) return;

    carriageOffset.current = calculateCarriageOffset();
    setCarriageOffset(carriageOffset.current);

    // Trigger stamp animation
    editor.classList.remove("stamp-effect");
    void editor.offsetWidth; // Forces a reflow
    editor.classList.add("stamp-effect");

  }, [text, editorRef, setCarriageOffset]);

}
