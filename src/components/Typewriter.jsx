import { useState, useRef } from "react";
import ParchmentEditor from "./ParchmentEditor";

export default function Typewriter({ onLayoutReady }) {

  return (
    <div className="typewriter-container">
      <ParchmentEditor onLayoutReady={onLayoutReady} />
    </div>
  );
}


