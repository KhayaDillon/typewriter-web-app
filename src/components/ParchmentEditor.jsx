import { useState, useEffect, useRef } from "react";
import parchmentImg from "../assets/parchment.png";
import platenImg from "../assets/platen.png";
import typewriterImg from "../assets/typewriter.png";
import "../App.css";

import useTypewriterSounds from "../hooks/useTypewriterSounds";
import useLineTracking from "../hooks/useLineTracking";
import useTypingAnimations from "../hooks/useTypingAnimations";


export default function ParchmentEditor({
  text,            
  setText,         
  carriageOffset,
  setCarriageOffset,  
  paperOffset,    
  setPaperOffset,  
  editorRef,       // Ref to access the editable div
  offsetRef,       // Ref to track carriage offset for animations
}) {

  const INITIAL_OFFSET = 750; // Baseline paper position before it moves
  const MAX_CARRIAGE_OFFSET = 500;

  const [caretIndex, setCaretIndex] = useState(0); // Tracks where new characters are inserted
  const [carriageStarted, setCarriageStarted] = useState(false);
  const {
    playKeySound,
    playReturnSound,
    playSpacebarSound,
  } = useTypewriterSounds(offsetRef.current);
    const justWrappedRef = useRef(false);
    const lineTrackingDidMountRef = useRef(false);
    const typingDidMountRef = useRef(false);

  useLineTracking({ 
    text, 
    editorRef, 
    justWrappedRef, 
    offsetRef, 
    setCarriageOffset, 
    setPaperOffset, 
    didMountRef: lineTrackingDidMountRef, 
    playReturnSound, 
  });
  useTypingAnimations({ 
    text, 
    editorRef, 
    justWrappedRef, 
    offsetRef, 
    setCarriageOffset, 
    didMountRef: typingDidMountRef 
  });

  // 🔎 Focus editor when paper is clicked
  const handleClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
  
      // ⏩ On first focus, move carriage to far right
      if (!carriageStarted) {
        offsetRef.current = MAX_CARRIAGE_OFFSET;
        setCarriageOffset(MAX_CARRIAGE_OFFSET);
        setCarriageStarted(true);
        playReturnSound(); // 📣 Play sound on first focus
      }
    }
  };

  // ⌨️ Insert character into text at caret index
  const insertCharAtCaret = (char) => {
    const before = text.slice(0, caretIndex);   
    const after = text.slice(caretIndex);       
    setText(before + char + after);             // Recombine with inserted character
    setCaretIndex(caretIndex + 1);              // Move caret forward
  };

  const isValidTypingKey = (event) => {
    const { key, ctrlKey, altKey, metaKey } = event;
  
    // Block modifier combos (e.g., Ctrl+C, Alt+Tab)
    if (ctrlKey || altKey || metaKey) return false;
  
    // Block keys like Shift, CapsLock, etc.
    if (key.length > 1) return false;
  
    // Allow printable characters (letters, numbers, symbols)
    return true;
  };

  // ⌨️ Handle key presses manually
  const handleKeyDown = (e) => {
    e.preventDefault();
    if (!carriageStarted) return;
  
    const key = e.key;
    const selection = window.getSelection();
    const container = editorRef.current;
    if (!selection || !selection.rangeCount || !container) return;
  
    const range = selection.getRangeAt(0);
  
    // 🧼 Selection deletion
    if (key === "Backspace" || key === "Delete") {
      if (!range.collapsed) {
        const selectedSpans = [
          ...container.querySelectorAll(".whiteout-selection"),
        ];
        if (selectedSpans.length > 0) {
          setTimeout(() => {
            selectedSpans.forEach((span) =>
              span.classList.add("whiteout-deleting")
            );
  
            setTimeout(() => {
              const indexes = selectedSpans.map((s) => Number(s.dataset.index));
              const start = Math.min(...indexes);
              const end = Math.max(...indexes) + 1;
              const newText = text.slice(0, start) + text.slice(end);
              setText(newText);
              setCaretIndex(start);
            }, 600);
          }, 50);
          return;
        }
      }
  
      if (caretIndex > 0) {
        setText(text.slice(0, caretIndex - 1) + text.slice(caretIndex));
        setCaretIndex(caretIndex - 1);
      }
  
      playKeySound();
      return;
    }
  
    // ⬅️➡️ Arrows
    if (key === "ArrowLeft") {
      setCaretIndex(Math.max(0, caretIndex - 1));
      return;
    } else if (key === "ArrowRight") {
      setCaretIndex(Math.min(text.length, caretIndex + 1));
      return;
    }
  
    // ⏎ Enter key
    if (key === "Enter") {
      insertCharAtCaret("\n");
      playReturnSound();
      return;
    }
  
    // ␣ Spacebar
    if (key === " " || key === "Spacebar") {
      insertCharAtCaret(" ");
      playSpacebarSound();
      return;
    }
  
    // 🛑 Filter out non-printable
    if (!isValidTypingKey(e)) return;
  
    // ✅ Default key: printable char
    insertCharAtCaret(key);
    playKeySound();
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
    if (!carriageStarted) return;

    setCaretManually();

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const container = editorRef.current;
      if (!selection || !container || !selection.rangeCount) return;
  
      const range = selection.getRangeAt(0);
  
      // Clear all previous selection classes
      container.querySelectorAll(".whiteout-selection").forEach((el) => {
        el.classList.remove("whiteout-selection");
      });
  
      // Apply whiteout-selection class to intersecting spans
      const spans = container.querySelectorAll("span[data-index]");
      spans.forEach((span) => {
        if (range.intersectsNode(span)) {
          span.classList.add("whiteout-selection");
        }
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [text, caretIndex, editorRef]);

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
              transform: `translateY(calc(${INITIAL_OFFSET}px - ${paperOffset}px))`,
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
