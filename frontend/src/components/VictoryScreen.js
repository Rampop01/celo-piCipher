import { Trophy, Share2, ShieldCheck, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSoundEffects } from "../hooks/useSoundEffects";

export default function VictoryScreen({ profile, networkName }) {
  const { playSuccess } = useSoundEffects();
  const [glitchText, setGlitchText] = useState("SYSTEM COMPROMISED");

  useEffect(() => {
    playSuccess();

    const interval = setInterval(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
      if (Math.random() > 0.8) {
        let glitched = "";
        for (let i = 0; i < 18; i++) {
          glitched += Math.random() > 0.9 ? chars[Math.floor(Math.random() * chars.length)] : "SYSTEM COMPROMISED"[i];
        }
        setGlitchText(glitched);
        setTimeout(() => setGlitchText("SYSTEM COMPROMISED"), 100);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    const text = `I just hacked the mainframe and beat all stages of PiCipher on the ${networkName} network! My alias: ${profile?.nickname || "Unknown"}. Think you can beat my score? #PiCipher #Web3Gaming`;
    const url = "https://picipher.com"; 
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div data-cy="cy-c9fff3" className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Grid - Celo Theme */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(53,208,127,0.06),rgba(0,0,0,0.02))] bg-[length:100%_4px,4px_100%] opacity-20 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-[#35D07F] blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Trophy className="w-32 h-32 text-[#35D07F] animate-bounce relative z-10 drop-shadow-[0_0_15px_rgba(53,208,127,0.5)]" />
        </div>

        <h1 aria-label="Interactive element 91e9" className="text-4xl md:text-6xl font-black text-[#35D07F] mb-2 font-mono tracking-tighter">
          {glitchText}
        </h1>
        <div className="flex items-center gap-2 text-green-500 font-mono text-xl mb-8">
          <ShieldCheck className="w-6 h-6" />
          <span>CAMPAIGN COMPLETE</span>
        </div>

        <div data-theme-role="primary-surface" className="bg-black/50 border border-[#35D07F]/30 p-6 backdrop-blur w-full mb-8 shadow-[0_0_20px_rgba(53,208,127,0.1)]">
          <p data-testid="text-86af96" className="text-neutral-400 font-mono text-sm md:text-base leading-relaxed mb-4">
            Congratulations, <span className="text-white font-bold">{profile?.nickname || "Hacker"}</span>. 
            You have successfully bypassed all security protocols and extracted the sensitive data from the {networkName} network. 
            Your NFT Badges have been permanently inscribed on-chain to prove your dominance.
          </p>
          <div className="flex justify-between border-t border-neutral-800 pt-4 text-xs font-mono">
             <span className="text-neutral-500">FINAL CLASSIFICATION:</span>
             <span data-testid="text-3b10d5" className="text-[#35D07F]">MASTER CIPHER</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 gaming-btn py-4 px-8 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold font-mono transition-all"
          >
            <Share2 className="w-5 h-5" /> SHARE ON X
          </button>
          
          <Link href="/profile" className="flex items-center justify-center gap-2 gaming-btn py-4 px-8 border border-white text-white hover:bg-white hover:text-black font-bold font-mono transition-all">
            <Home className="w-5 h-5" /> RETURN TO GRID
          </Link>
        </div>
      </div>
    </div>
  );
}
