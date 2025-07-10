import { useState, useRef } from "react";
import TypewriterEffect from "./TypewriterEffect";
import ParchmentEditor from "./ParchmentEditor";

export default function Typewriter() {
  const [text, setText] = useState("");
  const [carriageOffset, setCarriageOffset] = useState(0); // horizontal shift
  const [paperOffset, setPaperOffset] = useState(0);       // vertical shift

  const editorRef = useRef(null);
  const offsetRef = useRef(0);

  return (
    <div className="typewriter-container">
      <TypewriterEffect 
        text={text}  
        setCarriageOffset={setCarriageOffset}
        setPaperOffset={setPaperOffset}
        editorRef={editorRef}
        offsetRef={offsetRef}
      />
      <ParchmentEditor 
        text={text} 
        setText={setText} 
        carriageOffset={carriageOffset}
        setCarriageOffset={setCarriageOffset}
        paperOffset={paperOffset}
        editorRef={editorRef}
        offsetRef={offsetRef}
      />
    </div>
  );
}


