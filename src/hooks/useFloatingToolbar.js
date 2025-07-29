import { useEffect, useState } from "react";

export default function useFloatingToolbar(editorRef) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedRange, setSelectedRange] = useState(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (!editorRef.current || !selection || selection.rangeCount === 0) {
        setIsVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const isCollapsed = range.collapsed;
      const editorContainsSelection = editorRef.current.contains(range.commonAncestorContainer);

      if (!isCollapsed && editorContainsSelection) {
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();

        setPosition({
          top: rect.top - editorRect.top - 40, // float above selection
          left: rect.left - editorRect.left + rect.width / 2,
        });

        setSelectedRange(range);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setSelectedRange(null);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editorRef]);

  return { isVisible, position, selectedRange };
}
