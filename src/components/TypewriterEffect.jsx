import { useEffect, useRef } from "react";

export default function TypewriterEffect({
  text,
  setText,
  setCarriageOffset,
  setPaperOffset,
  mirrorRef,
}) {

  const offset = useRef(0);

  const prevLength = useRef(0);
  const prevText = useRef("");
  const prevLines = useRef(1);
  
  const justWrapped = useRef(false);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      const mirrorHeight = mirrorRef.current?.offsetHeight ?? 0;
      const lineHeight = 16 * 1.5;
      const initialLineCount = Math.ceil(mirrorHeight / lineHeight);
      console.log(initialLineCount)
      prevLines.current = initialLineCount; // 🛡️ Set actual baseline
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

    const mirrorHeight = mirrorRef.current?.offsetHeight ?? 0;
    const lineHeight = 16 * 1.5; // match font-size * line-height
    const currentLineCount = Math.ceil(mirrorHeight / lineHeight);

    console.log("Mirror height:", mirrorHeight);
    console.log("Line count:", currentLineCount, "Prev:", prevLines.current);

    // Handle autowrap
    if (currentLineCount > prevLines.current && prevLength.current > 0) {
      justWrapped.current = true;
      offset.current = 0;
      setCarriageOffset(0);
      setPaperOffset((prev) => prev + 20);
    }

    // Handle typing
    if (lengthDiff > 0) {
      if (justWrapped.current) {
        justWrapped.current = false;
      } else {
        offset.current = Math.min(500, offset.current + 5);
        setCarriageOffset(offset.current);
      }
    }
  
    // Handle backspace
    if (lengthDiff < 0) {
      // Move left when backspacing 
      offset.current = Math.max(0, offset.current - 5);
      setCarriageOffset(offset.current);
    }

    // Handle manual newline (Enter), only if not from wrapping
    if (isNewLineAdded && !justWrapped.current) {
      offset.current = 0;
      setCarriageOffset(0);
      setPaperOffset((prev) => prev + 20);
    }

    // Handle removed newline
    if (isNewLineRemoved) {
      setPaperOffset((prev) => Math.max(0, prev - 20));
    }

    // Save state
    prevLines.current = currentLineCount;
    prevLength.current = text.length;
    prevText.current = text;
  }, [text]);
  

  return null; // No UI, logic only
}
