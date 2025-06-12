import { useState } from "react";
import TypewriterEffect from "./TypewriterEffect";
import TypewriterSounds from "./TypewriterSounds";
import ParchmentEditor from "./ParchmentEditor";

export default function Typewriter() {
  const [text, setText] = useState("");
  const [carriageOffset, setCarriageOffset] = useState(0); // horizontal shift
  const [paperOffset, setPaperOffset] = useState(0);       // vertical shift

  return (
    <div className="typewriter-container">
      <TypewriterEffect 
        text={text} 
        setText={setText}  
        setCarriageOffset={setCarriageOffset}
        setPaperOffset={setPaperOffset}
      />
      <TypewriterSounds text={text} />
      <ParchmentEditor 
        text={text} 
        setText={setText} 
        carriageOffset={carriageOffset}
        paperOffset={paperOffset}
      />
    </div>
  );
}


