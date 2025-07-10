import { useRef } from "react";
import useLineTracking from "../hooks/useLineTracking";
import useTypingAnimations from "../hooks/useTypingAnimations";

export default function TypewriterEffect({ 
  text, 
  setCarriageOffset, 
  setPaperOffset, 
  editorRef,
  offsetRef, 
}) {

  const justWrappedRef = useRef(false);
  const lineTrackingDidMountRef = useRef(false);
  const typingDidMountRef = useRef(false);

  useLineTracking({ text, editorRef, justWrappedRef, offsetRef, setCarriageOffset, setPaperOffset, didMountRef: lineTrackingDidMountRef });
  useTypingAnimations({ text, editorRef, justWrappedRef, offsetRef, setCarriageOffset, didMountRef: typingDidMountRef });

  return null;
}
