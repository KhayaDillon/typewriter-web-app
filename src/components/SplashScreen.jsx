import { useEffect, useState } from "react";

function SplashScreen({ readyToReveal, onFinish, setStartBlurReveal }) {
  const [timeElapsed, setTimeElapsed] = useState(false);
  const [startParchmentFade, setStartParchmentFade] = useState(false);
  const [startTitleFade, setStartTitleFade] = useState(false);
  const [hideCaret, setHideCaret] = useState(false);

  // Ensure minimum time is met
  useEffect(() => {
    const minDisplay = setTimeout(() => setTimeElapsed(true), 3000);
    return () => clearTimeout(minDisplay);
  }, []);

  // Handle reveal sequence
  useEffect(() => {
    if (timeElapsed && readyToReveal) {
      // Hide the caret immediately before blur reveal
      setHideCaret(true);
      setStartBlurReveal(true);

      const parchmentTimer = setTimeout(() => {
        setStartParchmentFade(true);

        const titleTimer = setTimeout(() => {
          setStartTitleFade(true);

          const doneTimer = setTimeout(() => {
            onFinish?.();
          }, 2300);

          return () => clearTimeout(doneTimer);
        }, 1000);

        return () => clearTimeout(titleTimer);
      }, 1000);

      return () => clearTimeout(parchmentTimer);
    }
  }, [readyToReveal, timeElapsed, onFinish]);

  return (
    <>
      {/* Parchment background layer */}
      <div className={`splash-screen parchment ${startParchmentFade ? "blur-out" : ""}`} />
      {/* Title and logo */}
      <div className={`splash-text ${startTitleFade ? "fade-out" : ""}`}>
        <div className="splash-title">
            <span>Welcome to</span> <br/>
            <span className="quiet-type-logo">
                <span className="static-text">The Quiet </span>
                <span className="type-words-wrapper">
                    <span className="type-words">Type</span>
                    <span className={`caret ${hideCaret ? 'caret-hidden' : ''}`} />
                </span>
            </span>
        </div>
    </div>
    </>
  );
}

export default SplashScreen;