import { useEffect, useRef } from "react";
import key1 from "../assets/key1.mp3";
import key2 from "../assets/key2.mp3";
import key3 from "../assets/key3.mp3";
import returnSoundSrc from "../assets/return.wav";
import spacebarSoundSrc from "../assets/spacebar.mp3";

export default function useTypewriterSounds(currentOffset) {

  const keySounds = useRef([]);
  const returnSound = useRef(null);
  const spacebarSound = useRef(null);
  const currentKeyIndex = useRef(0);

  const CARRIAGE_TRANSFORM_DURATION = 0.4; // seconds

  useEffect(() => {
    keySounds.current = [new Audio(key1), new Audio(key2), new Audio(key3)];
    returnSound.current = new Audio(returnSoundSrc);
    spacebarSound.current = new Audio(spacebarSoundSrc);
  }, []);

  const playSound = (audioRef) => {
    if (!audioRef.current) return;
    const clone = audioRef.current.cloneNode();
    clone.currentTime = 0;
    clone.play().catch((err) => {
      // Ignore errors (e.g., autoplay blocked)
      console.warn("Sound play error:", err);
    });
  };

  const playKeySound = () => {
    const index = currentKeyIndex.current % keySounds.current.length;
    const sound = keySounds.current[index];
    currentKeyIndex.current++;
    if (sound) playSound({ current: sound });
  };

  const playReturnSoundBasedOnOffset = (currentOffset) => {
    const audio = returnSound.current.cloneNode();
    audio.currentTime = 0;
    audio.play();
  
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, CARRIAGE_TRANSFORM_DURATION * 1000); // Convert to ms
  };

  const playReturnSound = () => playReturnSoundBasedOnOffset(currentOffset);
  const playSpacebarSound = () => playSound(spacebarSound);

  return {
    playKeySound,
    playReturnSound,
    playSpacebarSound,
  };
}