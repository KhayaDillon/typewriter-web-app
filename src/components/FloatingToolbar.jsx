import React from "react";

const BUTTONS = [
  { label: "B", command: "bold", title: "Bold" },
  { label: "I", command: "italic", title: "Italic" },
  { label: "U", command: "underline", title: "Underline" },
  { label: "•", command: "insertUnorderedList", title: "Bullet List" },
  { label: "L", command: "justifyLeft", title: "Align Left" },
  { label: "C", command: "justifyCenter", title: "Align Center" },
  { label: "R", command: "justifyRight", title: "Align Right" },
  // Optional: fontSize dropdown or future controls
];

export default function FloatingToolbar({ position, onFormatClick }) {
  return (
    <div
      className="floating-toolbar"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {BUTTONS.map((btn) => (
        <button
          key={btn.command}
          title={btn.title}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent selection from breaking
            onFormatClick(btn.command);
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
