import { useState, useRef } from "react";
import parchmentImg from "../assets/parchment.png";
import "../App.css";


export default function ParchmentEditor() {
  const [text, setText] = useState("");
  const paperRef = useRef(null);

  const handleClick = () => {
    paperRef.current.focus();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div 
        className="relative w-[8.5in] h-[11in] bg-cover bg-center p-8 shadow-lg border border-gray-400 rounded-md"
        style={{ backgroundImage: `url(${parchmentImg})`
      }}
        onClick={handleClick}
      >
        <textarea
          ref={paperRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full bg-transparent resize-none focus:outline-none text-lg font-serif"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}
