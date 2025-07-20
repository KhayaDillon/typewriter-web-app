import { useEffect, useState } from "react";

function SplashScreen({ readyToReveal, onFinish, setStartBlurReveal }) {
  const [timeElapsed, setTimeElapsed] = useState(false);
  const [startParchmentFade, setStartParchmentFade] = useState(false);
  const [startTitleFade, setStartTitleFade] = useState(false);

  // Ensure minimum time is met
  useEffect(() => {
    const minDisplay = setTimeout(() => setTimeElapsed(true), 3000);
    return () => clearTimeout(minDisplay);
  }, []);

  // When app is ready & time has passed → begin blur reveal
  useEffect(() => {
    if (readyToReveal && timeElapsed) {
      setStartBlurReveal(true);

      const parchmentTimer = setTimeout(() => {
        setStartParchmentFade(true);

        const titleTimer = setTimeout(() => {
          setStartTitleFade(true);

          const doneTimer = setTimeout(() => {
            onFinish?.();
          }, 2300); // allow fade-out to finish

          return () => clearTimeout(doneTimer);
        }, 1000); // title fades out after parchment

        return () => clearTimeout(titleTimer);
      }, 1000); // parchment fades out after blur

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
            <span className="line line-1">Welcome to</span> <br/>
            <span className="line line-2 quiet-type-logo">The Quiet Type</span>
        </div>
    </div>
    </>
  );
}

export default SplashScreen;