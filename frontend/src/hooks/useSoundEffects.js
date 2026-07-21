"use client";

import { useEffect, useRef, useState } from "react";

export function useSoundEffects() {
  const audioCtxRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedMute = localStorage.getItem("picipher_muted");
    if (savedMute === "true") {
      setIsMuted(true);
    }

    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener("click", initAudio, { once: true });
    window.addEventListener("keydown", initAudio, { once: true });

    return () => {
      window.removeEventListener("click", initAudio);
      window.removeEventListener("keydown", initAudio);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newVal = !prev;
      localStorage.setItem("picipher_muted", String(newVal));
      // if we are muting and speech synthesis is playing, cancel it
      if (newVal && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return newVal;
    });
  };

  const playOscillator = (freq, type, duration, vol = 0.1) => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const playBlip = () => {
    playOscillator(800, "sine", 0.05, 0.05);
  };

  const playKeystroke = () => {
    playOscillator(400 + Math.random() * 100, "square", 0.02, 0.02);
  };

  const playSuccess = () => {
    if (isMuted || !audioCtxRef.current) return;
    playOscillator(600, "sine", 0.1, 0.1);
    setTimeout(() => playOscillator(800, "sine", 0.2, 0.1), 100);
    setTimeout(() => playOscillator(1200, "sine", 0.3, 0.1), 200);
  };

  const playError = () => {
    if (isMuted || !audioCtxRef.current) return;
    playOscillator(150, "sawtooth", 0.3, 0.1);
    setTimeout(() => playOscillator(100, "sawtooth", 0.4, 0.15), 150);
  };

  const playUnlock = () => {
    if (isMuted || !audioCtxRef.current) return;
    playOscillator(1200, "sine", 0.1, 0.1);
    setTimeout(() => playOscillator(1600, "sine", 0.3, 0.1), 100);
  };

  return { playBlip, playKeystroke, playSuccess, playError, playUnlock, isMuted, toggleMute };
}
