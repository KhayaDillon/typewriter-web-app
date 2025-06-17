import { useEffect, useRef } from "react";

export default function TypewriterEffect({
  text,
  setText,
  setCarriageOffset,
  setPaperOffset,
  mirrorRef,
  textareaRef,
}) {

  const offset = useRef(0);

  const prevLength = useRef(0);
  const prevText = useRef("");
  const prevLines = useRef(1);
  const prevNewlineCount = useRef(0);
  
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
    const currentNewlineCount = (text.match(/\n/g) || []).length;

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

        // Trigger paper stamp effect
        if (textareaRef?.current) {
          const el = textareaRef.current;
          el.classList.remove("stamp-effect");
          void el.offsetWidth; // force reflow
          el.classList.add("stamp-effect");
        }
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
    if (isNewLineRemoved || currentNewlineCount < prevNewlineCount.current) {
      setPaperOffset((prev) => Math.max(0, prev - 30));
    }

    // Save state
    prevNewlineCount.current = currentNewlineCount;
    prevLines.current = currentLineCount;
    prevLength.current = text.length;
    prevText.current = text;
  }, [text]);
  

  return null; // No UI, logic only
}
