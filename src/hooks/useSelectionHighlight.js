import { useEffect } from "react";

export default function useSelectionHighlight(editorRef, deps = []) {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      editor.querySelectorAll(".whiteout-selection").forEach((el) => {
        el.classList.remove("whiteout-selection");
      });

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
  }, deps); // deps = [text, caretIndex, ...] to rebind if needed
}
