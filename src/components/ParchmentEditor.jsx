import { useState, useEffect, useRef } from "react";
import useFloatingToolbar from "../hooks/useFloatingToolbar";
import useCaretTracking from "../hooks/useCaretTracking";
import useSelectionHighlight from "../hooks/useSelectionHighlight";
import FloatingToolbar from "./FloatingToolbar";
import parchmentImg from "../assets/parchment.png";
import "../App.css";

export default function ParchmentEditor({ 
    editorRef, 
    text, 
    setText, 
    offsetRefs, 
    setCarriageOffset,
    paperOffset,
    sounds
}) {
  const [carriageStarted, setCarriageStarted] = useState(false);
  const [justTyped, setJustTyped] = useState(false);
  const editor = editorRef.current;
  const {
    playKeySound,
    playReturnSound,
    playSpacebarSound,
    resumeAudioContext,
  } = sounds;

  const { isVisible, position, selectedRange } = useFloatingToolbar(editorRef);
  const { caretIndex, setCaretIndex, setCaretManually, moveCaret } = useCaretTracking(editorRef, text.length);
  useSelectionHighlight(editorRef, [text, caretIndex, editorRef, carriageStarted]);


  // 🔎 Focus editor when paper is clicked
  const handleClick = async () => {
    editorRef.current.focus();

    // 🎧 Ensure audio is resumed and sounds are loaded
    await resumeAudioContext();

    if (!carriageStarted) {
      playReturnSound();
      offsetRefs.carriageOffset.current = offsetRefs.maxCarriageOffset.current;
      setCarriageOffset(offsetRefs.carriageOffset.current);
      setCarriageStarted(true);
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
    if (!selection || !selection.rangeCount) return;
  
    const range = selection.getRangeAt(0);
  
    // 🧼 Selection deletion
    if (key === "Backspace" || key === "Delete") {
      if (!range.collapsed) {
        const selectedSpans = [
          ...editor.querySelectorAll(".whiteout-selection"),
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
    if (key === "ArrowLeft") return moveCaret("left");
    if (key === "ArrowRight") return moveCaret("right");
  
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
    setJustTyped(true);
  };

  // 🖋️ Render each character as a span for animation + caret targeting
  const renderTextWithAnimation = (text) => {
    return [...text].map((char, i) => {
      const isLast = justTyped && i === caretIndex - 1;

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

  //console.log("PaperOffset:", paperOffset, "CarriageOffset:", carriageOffset, "CaretIndex:", caretIndex, "TextLength:", text.length);
    useEffect(() => {
        if (!carriageStarted) return;
        if (!editor) return;

        setCaretManually();

        if (justTyped) {
            // Reset flag AFTER animation triggers
            const timeout = setTimeout(() => setJustTyped(false), 100);
            return () => clearTimeout(timeout);
        }
    }, [text, caretIndex, editorRef, carriageStarted, justTyped]);

 
  // 🧱 UI structure with background, editor, and typewriter
  return (
    <div
        className="parchment-paper"
        style={{
        backgroundImage: `url(${parchmentImg})`,
        transform: `translateY(calc(${paperOffset}px))`,
        }}
        onClick={handleClick}
        tabIndex="0"
    >
        {isVisible && (
            <FloatingToolbar
                position={position}
                onFormatClick={(command) => {
                document.execCommand(command, false, null);
                }}
            />
        )}

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
  );
}