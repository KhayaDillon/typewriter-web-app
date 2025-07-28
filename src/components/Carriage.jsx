import { useState, useEffect, useRef } from "react";
import platenImg from "../assets/platen.png";
import "../App.css";

import ParchmentEditor from "./ParchmentEditor";
import useTypewriterSounds from "../hooks/useTypewriterSounds";
import usePaperAnimation from "../hooks/usePaperAnimation";
import useCarriageAnimation from "../hooks/useCarriageAnimation";


export default function Carriage({ onLayoutReady, editorRef, paperOffset, setPaperOffset, sounds }) {
  const offsetRefs = {
    carriageOffset: useRef(0),
    paperOffset: useRef(0),
    maxCarriageOffset: useRef(359), // Max offset calculated on mount (initially placeholder)
    maxPaperOffset: useRef(792),    // Max paper offset (initially placeholder)
  };

  const [text, setText] = useState("");
  const [carriageOffset, setCarriageOffset] = useState(0); // horizontal shift
  const { playReturnSound } = useTypewriterSounds();


  usePaperAnimation({ 
    text, 
    editorRef, 
    offsetRefs,
    setCarriageOffset, 
    setPaperOffset, 
    onLayoutReady,
    playReturnSound, 
  });
  useCarriageAnimation({ 
    text, 
    editorRef, 
    offsetRefs, 
    setCarriageOffset, 
    onLayoutReady,
  });
 
  // 🧱 UI structure with background, editor, and typewriter
  return (
    <div
        className="carriage-and-paper"
        style={{ transform: `translateX(calc(-50% + ${carriageOffset}px))` }}
    >
        <img src={platenImg} alt="Platen Roller" className="platen-image" />
        <ParchmentEditor 
            editorRef={editorRef} 
            text={text} 
            setText={setText} 
            offsetRefs={offsetRefs} 
            setCarriageOffset={setCarriageOffset} 
            paperOffset={paperOffset}
            setPaperOffset={setPaperOffset}
            sounds={sounds}
        />
    </div>
  );
}
