import { useState } from "react";

import Typewriter from "./components/Typewriter";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

function App() {
  const [readyToReveal, setReadyToReveal] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [startBlurReveal, setStartBlurReveal] = useState(false);

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
        <Typewriter onLayoutReady={() => setReadyToReveal(true)} />
      </div>
    </div>
  );

}

export default App;