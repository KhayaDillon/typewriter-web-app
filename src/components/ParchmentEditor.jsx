import { useState, useEffect } from "react";
import parchmentImg from "../assets/parchment.png";
import platenImg from "../assets/platen.png";
import typewriterImg from "../assets/typewriter.png";
import "../App.css";

export default function ParchmentEditor({
  text,            
  setText,         
  carriageOffset,  
  paperOffset,     
  editorRef,       // Ref to access the editable div
}) {
  const [caretIndex, setCaretIndex] = useState(0); // Tracks where new characters are inserted
  const initialOffset = 750; // Baseline paper position before it moves

  // 🔎 Focus editor when paper is clicked
  const handleClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // ⌨️ Insert character into text at caret index
  const insertCharAtCaret = (char) => {
    const before = text.slice(0, caretIndex);   
    const after = text.slice(caretIndex);       
    setText(before + char + after);             // Recombine with inserted character
    setCaretIndex(caretIndex + 1);              // Move caret forward
  };

  // ⌨️ Handle key presses manually
  const handleKeyDown = (e) => {
    e.preventDefault();

    if (e.key === "Backspace") {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
    
      const range = selection.getRangeAt(0);
      const container = editorRef.current;
    
      if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) {
        return; // Selection is outside the editable area
      }
    
      // Check if it's a selection (not just a caret)
      if (!range.collapsed) {
        const allSpans = [...container.querySelectorAll("span[data-index]")];
    
        // Collect indexes within selection
        const selectedIndexes = allSpans.filter((span) => {
          const spanRange = document.createRange();
          spanRange.selectNodeContents(span);
          return (
            range.compareBoundaryPoints(Range.END_TO_START, spanRange) < 0 &&
            range.compareBoundaryPoints(Range.START_TO_END, spanRange) > 0
          );
        }).map((span) => Number(span.dataset.index));
    
        if (selectedIndexes.length > 0) {
          const start = Math.min(...selectedIndexes);
          const end = Math.max(...selectedIndexes) + 1;
    
          setText(text.slice(0, start) + text.slice(end));
          setCaretIndex(start);
          return;
        }
      }
    
      // Fallback: single char delete
      if (caretIndex > 0) {
        setText(text.slice(0, caretIndex - 1) + text.slice(caretIndex));
        setCaretIndex(caretIndex - 1);
      }
    } else if (e.key === "ArrowLeft") {
      setCaretIndex(Math.max(0, caretIndex - 1));
    } else if (e.key === "ArrowRight") {
      setCaretIndex(Math.min(text.length, caretIndex + 1));
    } else if (e.key.length === 1) {
      // Typeable character
      insertCharAtCaret(e.key);
    } else if (e.key === "Enter") {
      insertCharAtCaret("\n");
    }
  };

  // 🎯 Manually position the visual caret after updates
  const setCaretManually = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    const container = editorRef.current;

    if (!container || caretIndex > text.length) return;

    // Try to find the character span at the caret index
    const span = container.querySelector(`[data-index='${caretIndex}']`);

    if (span) {
      range.setStart(span, 0); // Set caret before the span
    } else {
      const last = container.lastChild;
      if (last) range.setStartAfter(last); // Place after last char
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range); // Apply caret range
  };

  // 🔁 Update caret position visually whenever text or caretIndex changes
  useEffect(() => {
    setCaretManually();
  }, [text, caretIndex]);

  // 🖋️ Render each character as a span for animation + caret targeting
  const renderTextWithAnimation = (text) => {
    return [...text].map((char, i) => {
      const isLast = i === caretIndex - 1;

      let className = "";
      if (isLast) className += " animated-char";

      return (
        <span
          key={i}
          data-index={i}
          className={className || undefined}
        >
          {char === "\n" ? <br /> : char}
        </span>
      );
    });
  };

  // 🧱 UI structure with background, editor, and typewriter
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
            style={{
              backgroundImage: `url(${parchmentImg})`,
              transform: `translateY(calc(${initialOffset}px - ${paperOffset}px))`,
            }}
            onClick={handleClick}
            tabIndex="0"
          >
            <div
              ref={editorRef}
              className="parchment-textarea"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
            >
              {text.length === 0 ? (
                <span className="placeholder">Start writing...</span>
              ) : (
                renderTextWithAnimation(text)
              )}
            </div>
          </div>
        </div>
        <img src={typewriterImg} alt="Typewriter" className="typewriter-image" />
      </div>
    </div>
  );
}
