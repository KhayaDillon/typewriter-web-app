import { useEffect, useRef, useState } from "react";
import key1 from "../assets/key1.mp3";
import key2 from "../assets/key2.mp3";
import key3 from "../assets/key3.mp3";
import spacebarSoundSrc from "../assets/spacebar.mp3";

export default function useTypewriterSounds() {
  const RETURN_SOUND_URL = "/return_4_sec.wav";

  const audioContextRef = useRef(null);
  const keyBuffers = useRef([]);
  const returnBuffer = useRef(null);
  const spacebarBuffer = useRef(null);
  const currentKeyIndex = useRef(0);
  const hasLoadedSounds = useRef(false);
  const [soundsReady, setSoundsReady] = useState(false);

  const loadSound = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContextRef.current.decodeAudioData(arrayBuffer);
  };

  const prewarmBuffer = (buffer) => {
    if (!buffer) return;
    const source = audioContextRef.current.createBufferSource();
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = 0;
    source.buffer = buffer;
    source.connect(gainNode).connect(audioContextRef.current.destination);

    try {
      source.start();
      source.stop(audioContextRef.current.currentTime + 0.01);
    } catch (err) {
      console.warn("❌ Error prewarming audio:", err);
    }
  };

  const loadAllSounds = async () => {
    console.log("📦 Starting to load all sounds...");
    if (hasLoadedSounds.current) return;

    try {
      const [buf1, buf2, buf3, returnBuf, spaceBuf] = await Promise.all([
        loadSound(key1),
        loadSound(key2),
        loadSound(key3),
        loadSound(RETURN_SOUND_URL),
        loadSound(spacebarSoundSrc),
      ]);

      keyBuffers.current = [buf1, buf2, buf3];
      returnBuffer.current = returnBuf;
      spacebarBuffer.current = spaceBuf;

      [buf1, buf2, buf3, returnBuf, spaceBuf].forEach(prewarmBuffer);

      hasLoadedSounds.current = true;
      setSoundsReady(true);
      console.log("✅ All sounds loaded and prewarmed.");
    } catch (err) {
      console.error("❌ Error loading sounds:", err);
    }
  };

  const resumeAudioContext = async () => {
    console.log("🎯 resumeAudioContext() called");
    const ctx = audioContextRef.current;
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
        console.log("🔊 AudioContext resumed");
        await loadAllSounds();
      } catch (err) {
        console.warn("⚠️ Failed to resume AudioContext:", err);
      }
    } else if (ctx && !hasLoadedSounds.current) {
      await loadAllSounds();
    }
  };

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioCtx;

    console.log("🔧 AudioContext initialized in suspended state:", audioContextRef.current?.state);

    return () => {
      audioCtx.close();
    };
  }, []);

  const playBuffer = (buffer) => {
    if (!buffer) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start(audioContextRef.current.currentTime);
  };

  const playKeySound = () => {
    const keys = keyBuffers.current;
    if (keys.length === 0) return;
    const index = currentKeyIndex.current % keys.length;
    playBuffer(keys[index]);
    currentKeyIndex.current++;
  };

  const playReturnSound = () => {
    console.log("🔁 Playing return sound");
    if (!returnBuffer.current) {
      console.warn("🚫 Return buffer is null!");
      return;
    }
    playBuffer(returnBuffer.current);
  };

  const playSpacebarSound = () => {
    playBuffer(spacebarBuffer.current);
  };

  return {
    soundsReady,
    resumeAudioContext, // call this from ParchmentEditor
    playKeySound,
    playReturnSound,
    playSpacebarSound,
  };
}
