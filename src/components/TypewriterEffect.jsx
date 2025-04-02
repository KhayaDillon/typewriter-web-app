import { useEffect, useRef } from "react";

export default function TypewriterEffect({ text, setText }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setText((prev) => prev + "\n");
    }
  };

  return (
    <textarea
      ref={textRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full h-full bg-transparent resize-none focus:outline-none text-lg font-serif"
      placeholder="Start typing..."
    />
  );
}
