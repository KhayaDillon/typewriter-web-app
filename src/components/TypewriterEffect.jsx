import { useEffect, useRef } from "react";

export default function TypewriterEffect({
  text,
  setText,
  setCarriageOffset,
  setPaperOffset,
}) {
  const prevLength = useRef(0);
  const prevText = useRef("");
  const offset = useRef(0);

  useEffect(() => {
    const lengthDiff = text.length - prevLength.current;
  
    const isNewLineAdded =
      text.length > prevText.current.length &&
      text[text.length - 1] === "\n";

    const isNewLineRemoved =
      text.length < prevText.current.length &&
      prevText.current.endsWith("\n") &&
      !text.endsWith("\n");
  

    if (lengthDiff > 0) {
      // Move right when typing
      offset.current = Math.min(500, offset.current + 5);
      setCarriageOffset(offset.current);
    }
  
    if (lengthDiff < 0) {
      // Move left when typing
      offset.current = Math.max(0, offset.current - 5);
      setCarriageOffset(offset.current);
    }

    if (isNewLineAdded) {
      offset.current = 0;
      setCarriageOffset(0);
      setPaperOffset((prev) => prev + 20);
    }

    if (isNewLineRemoved) {
      setPaperOffset((prev) => Math.max(0, prev - 20));
    }
  
    prevLength.current = text.length;
    prevText.current = text;
  }, [text, setCarriageOffset, setPaperOffset]);
  

  return null; // No UI, logic only
}
