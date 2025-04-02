import { useState } from "react";
import TypewriterEffect from "./TypewriterEffect";
import TypewriterSounds from "./TypewriterSounds";

export default function Typewriter() {
  const [text, setText] = useState("");

  const handleKeyPress = (event) => {
    setText((prev) => prev + event.key);
  };

  return (
    <div className="typewriter-container" onKeyDown={handleKeyPress} tabIndex={0}>
      <TypewriterEffect text={text} />
      <TypewriterSounds text={text} />
    </div>
  );
}
