import { useState, useRef } from "react";
import parchmentImg from "../assets/parchment.png";
import "../App.css";


export default function ParchmentEditor() {
  const [text, setText] = useState("");
  const paperRef = useRef(null);

  const handleClick = () => {
    if (paperRef.current) {
      paperRef.current.focus();
    }
  };

  return (
    <div className="parchment-container">
      <div 
        className="parchment-paper"
        style={{ backgroundImage: `url(${parchmentImg})` }}
        onClick={handleClick}
        tabIndex="0"  // Allows div to be focusable
      >
        <textarea
          ref={paperRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="parchment-textarea"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}