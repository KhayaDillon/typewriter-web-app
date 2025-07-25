import { useState, useRef } from "react";
import Typewriter from "./Typewriter";

export default function TypewriterDesk({ onLayoutReady }) {

  return (
    <div className="desk-container">
      <Typewriter onLayoutReady={onLayoutReady} />
    </div>
  );
}


