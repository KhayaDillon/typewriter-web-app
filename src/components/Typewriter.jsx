import { useState, useRef } from "react";
import ParchmentEditor from "./ParchmentEditor";

export default function Typewriter() {
  const [text, setText] = useState("");
  const [carriageOffset, setCarriageOffset] = useState(0); // horizontal shift
  const [paperOffset, setPaperOffset] = useState(0);       // vertical shift

  const editorRef = useRef(null);
  const offsetRef = useRef(0);

  return (
    <div className="typewriter-container">
      <ParchmentEditor 
        text={text} 
        setText={setText} 
        carriageOffset={carriageOffset}
        setCarriageOffset={setCarriageOffset}
        paperOffset={paperOffset}
        setPaperOffset={setPaperOffset}
        editorRef={editorRef}
        offsetRef={offsetRef}
      />
    </div>
  );
}


