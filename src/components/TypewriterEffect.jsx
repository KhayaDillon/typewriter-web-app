import { useEffect } from "react";

export default function TypewriterEffect({ text, setText }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore special control keys
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      e.preventDefault();

      if (e.key === "Backspace") {
        setText((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        setText((prev) => prev + "\n");
      } else if (e.key.length === 1) {
        setText((prev) => prev + e.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setText]);

  return null; // Logic only
}