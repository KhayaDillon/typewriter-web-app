import { useState, useRef } from "react";
import Typewriter from "./Typewriter";

export default function TypewriterDesk({ onLayoutReady, sounds }) {

  return (
    <div className="desk-container">
      <Typewriter onLayoutReady={onLayoutReady} sounds={sounds}/>
    </div>
  );
}


