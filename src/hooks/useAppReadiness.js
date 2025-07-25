import { useLayoutEffect } from "react";

export default function useAppReadiness({
  editorRef,
  offsetRefs,
  setPaperOffset,
  onReady,
}) {

    const {
        maxCarriageOffset,
        maxPaperOffset,
    } = offsetRefs;

    useLayoutEffect(() => {
        function measureOffsets() {
            const editor = editorRef.current;
            const target = document.querySelector("#type-lever-target");

            if (!editor || !target) {
                requestAnimationFrame(measureOffsets); // Retry until ready
                return;
            }

            const targetRect = target.getBoundingClientRect();
            const editorRect = editor.getBoundingClientRect();

            const horizontalOffset = targetRect.left - editorRect.left;
            const verticalOffset = targetRect.top - editorRect.top;

            if (verticalOffset > 100) {
            maxCarriageOffset.current = horizontalOffset;
            maxPaperOffset.current = verticalOffset;
            setPaperOffset(verticalOffset);
            console.log("✅ Layout measured. Offset:", verticalOffset);
            onReady?.();
            } 
        }

        requestAnimationFrame(measureOffsets);
    }, [editorRef, setPaperOffset, onReady]);
}
