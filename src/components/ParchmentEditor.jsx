import { useState, useEffect, useRef } from "react";
import parchmentImg from "../assets/parchment.png";
import useTypewriterSounds from "../hooks/useTypewriterSounds";
import "../App.css";

export default function ParchmentEditor({ 
    editorRef, 
    text, 
    setText, 
    offsetRefs, 
    setCarriageOffset,
    paperOffset,
}) {
  const [caretIndex, setCaretIndex] = useState(0); // Tracks where new characters are inserted
  const [carriageStarted, setCarriageStarted] = useState(false);
  const {
    playKeySound,
    playReturnSound,
    playSpacebarSound,
  } = useTypewriterSounds();

  const editor = editorRef.current;


  // 🔎 Focus editor when paper is clicked
  const handleClick = () => {
    editorRef.current.focus();

    // ⏩ On first focus, move carriage to far right
    if (!carriageStarted) {
        playReturnSound(); // 📣 Play sound on first focus
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

    if (caretIndex > text.length) return;

    // Try to find the character span at the caret index
    const span = editor.querySelector(`[data-index='${caretIndex}']`);

    if (span) {
      range.setStart(span, 0); // Set caret before the span
    } else {
      const last = editor.lastChild;
      if (last) range.setStartAfter(last); // Place after last char
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range); // Apply caret range
  };

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

  //console.log("PaperOffset:", paperOffset, "CarriageOffset:", carriageOffset, "CaretIndex:", caretIndex, "TextLength:", text.length);

  useEffect(() => {
    if (!carriageStarted) return;
    if (!editor) return;

    setCaretManually();

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
  
      const range = selection.getRangeAt(0);
  
      // Clear all previous selection classes
      editor.querySelectorAll(".whiteout-selection").forEach((el) => {
        el.classList.remove("whiteout-selection");
      });
  
      // Apply whiteout-selection class to intersecting spans
      const spans = editor.querySelectorAll("span[data-index]");
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
  }, [text, caretIndex, editorRef, carriageStarted]);

 
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