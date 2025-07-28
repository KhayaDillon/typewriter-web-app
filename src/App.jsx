import { useState, useEffect } from "react";

import TypewriterDesk from "./components/TypewriterDesk";
import SplashScreen from "./components/SplashScreen";
import useTypewriterSounds from "./hooks/useTypewriterSounds";
import "./App.css";

function App() {
  const [layoutReady, setLayoutReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [startBlurReveal, setStartBlurReveal] = useState(false);

  const {
    soundsReady,
    resumeAudioContext,
    playKeySound,
    playReturnSound,
    playSpacebarSound
  } = useTypewriterSounds();

  const readyToReveal = layoutReady && soundsReady;

  useEffect(() => {
    if (layoutReady) console.log("📐 Layout is ready");
    if (soundsReady) console.log("🎧 Sounds are ready");
    if (readyToReveal) console.log("🚀 App is fully ready!");
  }, [layoutReady, soundsReady, readyToReveal]);

  return (
    <div className="app">
      {!splashDone && (
        <SplashScreen
          readyToReveal={readyToReveal}
          onFinish={() => setSplashDone(true)}
          setStartBlurReveal={setStartBlurReveal}
        />
      )}
      <div className={`app-content ${startBlurReveal ? 'pull-focus-in' : ''}`}>
        <TypewriterDesk 
          onLayoutReady={() => setLayoutReady(true)} 
          sounds={{
            resumeAudioContext,
            playKeySound,
            playReturnSound,
            playSpacebarSound
          }}
        />
      </div>
    </div>
  );

}

export default App;