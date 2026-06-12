"use client";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const faqData = [
  { q: "What is PiCipher?", a: "A fully decentralized AI-generated visual decryption game with voice input mechanics." },
  { q: "How do I play?", a: "Connect your wallet, analyze the 4 images, guess the shared concept using your microphone, and earn Celo bounties." },
  { q: "Why use voice input instead of typing?", a: "To make the gameplay more fluid and immersive. You have only seconds to react to the visual anomalies." },
  { q: "How are bounties calculated?", a: "The smart contract tracks the number of image reveals you required. If you guess the answer with only 1 image revealed, your bounty multiplier is maximum." }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [glitchTitle, setGlitchTitle] = useState("FAQ_DATABASE");
  const toggle = (i) => setActiveIndex(activeIndex === i ? null : i);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchTitle((prev) => (prev === "FAQ_DATABASE" ? "F@Q_D4T4B4S3" : "FAQ_DATABASE"));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto border-l-2 border-r-2 border-[#35D07F]/30 min-h-[80vh] p-4 sm:p-8 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#35D07F] to-[#1e9a58] tracking-widest uppercase">{glitchTitle}</h1>
          <Link href="/" className="px-4 py-2 border border-white/20 hover:border-white/60 text-xs transition-colors whitespace-nowrap">[ RETURN ]</Link>
        </div>
        <div className="flex flex-col gap-4 flex-grow">
          {faqData.map((item, i) => (
            <div key={i} onClick={() => toggle(i)} className="border border-white/10 p-5 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base sm:text-lg tracking-wide">{item.q}</span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeIndex === i ? 'rotate-90 text-[#35D07F]' : 'text-neutral-500'}`} />
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${activeIndex === i ? 'max-h-40 mt-4 opacity-100 border-t border-white/10 pt-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-xs text-neutral-600 tracking-widest">
          <p>STILL HAVE QUESTIONS? [ DISCORD_LINK_PENDING ]</p>
        </div>
      </div>
    </div>
  );
}
