import { useRef } from "react";
import useLineTracking from "../hooks/useLineTracking";
import useTypingAnimations from "../hooks/useTypingAnimations";

export default function TypewriterEffect({ 
  text, 
  setCarriageOffset, 
  setPaperOffset, 
  editorRef 
}) {

  const justWrappedRef = useRef(false);
  const lineTrackingDidMountRef = useRef(false);
  const typingDidMountRef = useRef(false);
  const offsetRef = useRef(0);

  useLineTracking({ text, editorRef, justWrappedRef, offsetRef, setPaperOffset, didMountRef: lineTrackingDidMountRef });
  useTypingAnimations({ text, editorRef, justWrappedRef, offsetRef, setCarriageOffset, didMountRef: typingDidMountRef });

  return null;
}
