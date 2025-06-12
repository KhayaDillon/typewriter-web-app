import { useEffect, useRef } from "react";

export default function TypewriterEffect({
  text,
  setText,
  setCarriageOffset,
  setPaperOffset,
}) {
  const prevLength = useRef(0);
  const offset = useRef(0);

  useEffect(() => {
    const lengthDiff = text.length - prevLength.current;

    if (lengthDiff > 0) {
      // Simulate moving right for each new character
      offset.current += 5; // Adjust this value as needed
      setCarriageOffset(offset.current);
    }

    // (Optional) carriage return on Enter or full line
    if (text.endsWith("\n")) {
      offset.current = 0;
      setCarriageOffset(0);
      setPaperOffset((prev) => prev + 20); // Move paper up slightly
    }

    prevLength.current = text.length;
  }, [text, setCarriageOffset, setPaperOffset]);

  return null; // No UI, logic only
}
