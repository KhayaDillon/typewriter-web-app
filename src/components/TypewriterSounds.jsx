import { useEffect, useRef } from "react";
import key1 from "../assets/key1.mp3";
import key2 from "../assets/key2.mp3";
import key3 from "../assets/key3.mp3";
import returnSoundSrc from "../assets/return.mp3";
import spacebarSoundSrc from "../assets/spacebar.mp3";

export default function TypewriterSounds() {
  const keySounds = useRef([]);
  const returnSound = useRef(null);
  const spacebarSound = useRef(null);
  const currentKeyIndex = useRef(0);

  useEffect(() => {
    keySounds.current = [new Audio(key1), new Audio(key2), new Audio(key3)];
    returnSound.current = new Audio(returnSoundSrc);
    spacebarSound.current = new Audio(spacebarSoundSrc);

    const handleKeyDown = (e) => {
      let sound;

      if (e.key === "Enter") {
        sound = returnSound.current;
      } else if (e.key === " ") {
        sound = spacebarSound.current;
      } else if (e.key.length === 1) {
        // Rotate through key sounds
        const index = currentKeyIndex.current % keySounds.current.length;
        sound = keySounds.current[index];
        currentKeyIndex.current++;
      }

      if (sound) {
        const clone = sound.cloneNode();
        clone.currentTime = 0;
        clone.play();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
