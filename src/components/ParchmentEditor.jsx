import { useRef } from "react";
import parchmentImg from "../assets/parchment.png";
import platenImg from "../assets/platen.png";
import typewriterImg from "../assets/typewriter.png"; // add this
import "../App.css";

export default function ParchmentEditor({ text, setText, carriageOffset, paperOffset, mirrorRef, textareaRef }) {

  const initialOffset = 750;

  const handleClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    console.log("Target value:", e.target.value);
  };

  const renderTextWithAnimation = (text) => {
    return [...text].map((char, i) => {
      const isLast = i === text.length - 1;
      return (
        <span
          key={i}
          className={isLast ? "animated-char" : undefined}
        >
          {char === "\n" ? "\n" : char}
        </span>
      );
    });
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
              ref={textareaRef}
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
              { text.length > 0 
                ? renderTextWithAnimation(text) 
                : <span className="placeholder">Start writing...</span>
              }
            </div>
          </div>
        </div>

        <img src={typewriterImg} alt="Typewriter" className="typewriter-image" />
      </div>
    </div>
  );
} 
