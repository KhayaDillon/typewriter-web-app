import { useState } from "react";
import TypewriterEffect from "./TypewriterEffect";
import TypewriterSounds from "./TypewriterSounds";
import ParchmentEditor from "./ParchmentEditor";

export default function Typewriter() {
  const [text, setText] = useState("");

  return (
    <div className="typewriter-container">
      <TypewriterEffect text={text} setText={setText} />
      <TypewriterSounds text={text} />
      <ParchmentEditor text={text} setText={setText} />
    </div>
  );
}


