"use client";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const faqData = [
  { q: "What is PiCipher?", a: "A fully decentralized AI-generated visual decryption game with voice input mechanics." },
  { q: "How do I play?", a: "Connect your wallet, analyze the 4 images, guess the shared concept using your microphone, and earn Celo bounties." }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggle = (i) => setActiveIndex(activeIndex === i ? null : i);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto border-l-2 border-r-2 border-[#35D07F]/30 min-h-[80vh] p-8">
        <h1 className="text-5xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#35D07F] to-[#1e9a58] tracking-widest uppercase">FAQ_DATABASE</h1>
        <div className="flex flex-col gap-4">
          {faqData.map((item, i) => (
            <div key={i} onClick={() => toggle(i)} className="border border-white/10 p-4 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center">
              <span className="font-bold text-lg">{item.q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
