import { useRef } from "react";
import parchmentImg from "../assets/parchment.png";
import platenImg from "../assets/platen.png";
import typewriterImg from "../assets/typewriter.png"; // add this
import "../App.css";

export default function ParchmentEditor({ text, setText, carriageOffset, paperOffset, mirrorRef }) {
  const paperRef = useRef(null);
  const initialOffset = 750;


  const handleClick = () => {
    if (paperRef.current) {
      paperRef.current.focus();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="parchment-container">
      <div className="typewriter-stack">
        <div 
          className="paper-track"
          style={{ transform: `translateX(calc(-50% + ${carriageOffset}px))` }}
        >
          <img src={platenImg} alt="Platen Roller" className="platen-image" />
          <div
            className="parchment-paper"
            style={{ backgroundImage: `url(${parchmentImg})`, 
              transform: `translateY(calc(${initialOffset}px - ${paperOffset}px))`
            }}
            onClick={handleClick}
            tabIndex="0"
          >
            <textarea
              ref={paperRef}
              value={text}
              onChange={handleChange}
              className="parchment-textarea"
              placeholder="Start writing..."
            />

            <div
              ref={mirrorRef}
              className="textarea-mirror"
              aria-hidden="true"
            >
              {text}
            </div>
          </div>
        </div>

        <img src={typewriterImg} alt="Typewriter" className="typewriter-image" />
      </div>
    </div>
  );
} 
