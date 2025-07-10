import { useEffect, useRef } from "react";

export default function useTypingAnimations({
  text,
  offsetRef,
  setCarriageOffset,
  justWrappedRef,
  editorRef,
  didMountRef
}) {
  const prevLength = useRef(0);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    if (!didMountRef.current) {
      prevLength.current = text.length;
      didMountRef.current = true;
      return;
    }

    const lengthDiff = text.length - prevLength.current;

    // Typing (not due to wrapping)
    if (lengthDiff > 0) {
      if (justWrappedRef.current) {
        justWrappedRef.current = false;
      } else {
        offsetRef.current = Math.max(-500, offsetRef.current - 14);
        setCarriageOffset(offsetRef.current);

        // Trigger stamp animation
        editor.classList.remove("stamp-effect");
        void editor.offsetRefWidth;
        editor.classList.add("stamp-effect");
      }
    }

    // Backspace
    if (lengthDiff < 0) {
      offsetRef.current = Math.min(500, offsetRef.current + 14);
      setCarriageOffset(offsetRef.current);
    }

    console.log("offsetRef.current:", offsetRef.current)

    // Save state
    prevLength.current = text.length;
  }, [text, editorRef, setCarriageOffset, justWrappedRef, didMountRef]);
}
