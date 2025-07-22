import { useEffect, useRef } from "react";
import key1 from "../assets/key1.mp3";
import key2 from "../assets/key2.mp3";
import key3 from "../assets/key3.mp3";
import returnSoundSrc from "../assets/return.wav";
import spacebarSoundSrc from "../assets/spacebar.mp3";

export default function useTypewriterSounds() {

  const keySounds = useRef([]);
  const returnSound = useRef(null);
  const spacebarSound = useRef(null);
  const currentKeyIndex = useRef(0);

  const CARRIAGE_TRANSFORM_DURATION = 0.4; // seconds

  useEffect(() => {
    const keyAudio = [new Audio(key1), new Audio(key2), new Audio(key3)];
    const returnAudio = new Audio(returnSoundSrc);
    const spaceAudio = new Audio(spacebarSoundSrc);

    // Preload
    keyAudio.forEach((a) => { a.load(); });
    returnAudio.load();
    spaceAudio.load();

    keySounds.current = keyAudio;
    returnSound.current = returnAudio;
    spacebarSound.current = spaceAudio;
    console.log("📦 Loaded returnSound:", returnSound.current.src);
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

  const playReturnSoundBasedOnOffset = () => {
    if (!returnSound.current) {
      console.warn("❌ returnSound ref is null!");
      return;
    }

    const audio = returnSound.current.cloneNode();
    console.log("🎧 Cloned returnSound:", audio.src);

    audio.currentTime = 0;

    audio.play()
      .then(() => {
        console.log("✅ Return sound played successfully");
      })
      .catch((err) => {
        console.warn("❌ Return sound failed to play:", err);
      });

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, CARRIAGE_TRANSFORM_DURATION * 1000);
  };

  const playReturnSound = () => playReturnSoundBasedOnOffset();
  const playSpacebarSound = () => playSound(spacebarSound);

  return {
    playKeySound,
    playReturnSound,
    playSpacebarSound,
  };
}