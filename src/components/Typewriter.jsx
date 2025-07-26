import { useState, useEffect, useRef } from "react";
import typewriterImg from "../assets/typewriter.png";
import "../App.css";

import Carriage from "./Carriage";
import useAppReadiness from "../hooks/useAppReadiness";


export default function Typewriter({ onLayoutReady }) {
  const offsetRefs = {
    carriageOffset: useRef(0),
    paperOffset: useRef(0),
    maxCarriageOffset: useRef(359), // Max offset calculated on mount (initially placeholder)
    maxPaperOffset: useRef(792),    // Max paper offset (initially placeholder)
  };
  const editorRef = useRef(null);
  const [paperOffset, setPaperOffset] = useState(0);       // vertical shift

  useAppReadiness({
    editorRef,
    offsetRefs,
    setPaperOffset,
    onReady: onLayoutReady,
  })

  // 🧱 UI structure with background, editor, and typewriter
  return (
    <div className="typewriter-stack">
      <Carriage 
        onLayoutReady={onLayoutReady} 
        editorRef={editorRef} 
        paperOffset={paperOffset} 
        setPaperOffset={setPaperOffset} 
      />
      <div id="type-lever-target" />
      <img src={typewriterImg} alt="Typewriter" className="typewriter-image" />
    </div>
  );
}
