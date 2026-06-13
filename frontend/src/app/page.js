"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Coins, Zap, ChevronRight, Lock, Image as ImageIcon, CheckCircle, Globe, Hexagon, Crosshair, Cpu, Database, Eye, Terminal, Trophy, Mic, BrainCircuit, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { login, authenticated, user, logout } = usePrivy();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [glitchText, setGlitchText] = useState("PIC CIPHER");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText((prev) => (prev === "PIC CIPHER" ? "P!C C1PH3R" : "PIC CIPHER"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-sans selection:bg-[#35D07F] selection:text-black">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#35D07F]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1e9a58]/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 select-none">
            <div className="w-3 h-3 bg-[#35D07F] rounded-full shadow-[0_0_10px_#35D07F] animate-pulse"></div>
            <div className="text-3xl font-black tracking-tighter flex items-center">
              <span className="text-white">Pi</span>
              <span className="text-[#35D07F] text-4xl -ml-0.5 -mr-0.5">C</span>
              <span className="text-white">ipher</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {authenticated ? (
              <>
                <span className="hidden md:inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-mono text-[#35D07F]">
                  {user?.email?.address || user?.wallet?.address?.slice(0,6) + '...'}
                </span>
                <Link href="/profile" className="hidden md:flex items-center gap-2 text-xs font-mono text-white/70 hover:text-[#35D07F] transition-colors">
                  <User className="w-4 h-4" /> [PROFILE]
                </Link>
                <Link href="/leaderboard" className="hidden md:flex items-center gap-2 text-xs font-mono text-white/70 hover:text-[#35D07F] transition-colors">
                  <Trophy className="w-4 h-4" /> [RANKINGS]
                </Link>
                <button 
                  onClick={logout}
                  className="gaming-btn px-6 py-2 border border-white/20 hover:border-white/60 hover:bg-white/10 text-xs text-white"
                >
                  DISCONNECT
                </button>
              </>
            ) : (
              <>
                <Link href="/leaderboard" className="hidden md:flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-white transition-colors mr-4">
                  <Trophy className="w-4 h-4" /> LEADERBOARD
                </Link>
                <button 
                  onClick={login}
                  className="gaming-btn px-6 py-2 border-2 border-[#35D07F] text-[#35D07F] text-sm hover:text-black hover:bg-[#35D07F] shadow-[0_0_15px_rgba(53,208,127,0.2)]"
                >
                  PLAY NOW
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* Auth State: Mode Selection */}
        {authenticated ? (
          <section className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#35D07F] to-[#1e9a58] mb-6 drop-shadow-[0_0_15px_rgba(53,208,127,0.3)]">
                  ENTER THE GRID
                </h2>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-mono">
                  &gt; Decrypt the visual anomalies. Speak the truth. Progress through 50 stages of increasing difficulty to earn your Celo bounties and exclusive NFT Badges.
                </p>
              </div>

              <div className="flex justify-center w-full">
                <button
                  onClick={() => router.push('/game/play')}
                  className="group relative px-12 py-6 bg-black/40 backdrop-blur-md border-2 border-[#35D07F] hover:bg-[#35D07F]/10 transition-all duration-300 shadow-[0_0_30px_rgba(53,208,127,0.2)] hover:shadow-[0_0_50px_rgba(53,208,127,0.4)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#35D07F]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10 text-2xl font-black text-[#35D07F] tracking-[0.2em] uppercase">
                    START GAME &rarr;
                  </span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Unauth State: Full Landing Page */
          <>
            {/* CRT Scanline Overlay for Hero */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

            {/* Hero Section */}
            <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center justify-center text-center">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#35D07F] to-[#1e9a58] drop-shadow-[0_0_25px_rgba(53,208,127,0.4)] glitch-effect mb-8">
                {glitchText}
              </h2>
              <p className="text-neutral-400 text-lg md:text-xl tracking-widest uppercase max-w-2xl leading-relaxed mb-12">
                Decrypt the AI visuals. <br/> Speak the hidden word. <br/> Claim the bounty.
              </p>
              
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <button 
                  onClick={login}
                  className="gaming-btn group relative px-10 py-5 bg-transparent border-2 border-[#35D07F] text-[#35D07F] font-bold text-xl md:text-2xl tracking-[0.2em] uppercase hover:text-black shadow-[0_0_20px_rgba(53,208,127,0.3)]"
                >
                  &gt; Press Start to Connect &lt;
                </button>
              </div>
            </section>

            {/* Interactive Preview Section */}
            <section className="py-24 px-6 relative border-y border-[#35D07F]/20 bg-black/80 overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                  <h2 className="text-4xl md:text-5xl font-black text-[#35D07F] drop-shadow-[0_0_4px_rgba(53,208,127,0.6)]">THE ULTIMATE TEST OF PERCEPTION</h2>
                  <p className="text-lg text-neutral-400 leading-relaxed font-mono">
                    &gt; You are presented with 4 seemingly random AI-generated images. They all share one conceptual link. Can you find it?
                    The catch: revealing fewer images rewards you with a significantly higher multiplier on your Celo bounty.
                  </p>
                  <ul className="space-y-4 font-mono">
                    {[
                      "Dynamic AI generation means no two puzzles are alike.",
                      "Smart contract verification ensures provably fair rewards.",
                      "Real-time voice recognition for instant, seamless answers."
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="text-[#35D07F] font-black">[ + ]</div>
                        <span className="text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Visual Mockup */}
                <div className="flex-1 w-full max-w-lg aspect-square grid grid-cols-2 gap-4 group perspective-1000 relative">
                  <div className="absolute inset-0 border-2 border-[#35D07F]/30 pointer-events-none group-hover:border-[#35D07F] transition-colors duration-500 shadow-[0_0_30px_rgba(53,208,127,0.1)] difficulty-card"></div>
                  {[1, 2, 3, 4].map((box) => (
                    <div key={box} className="bg-black border border-[#35D07F]/20 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:border-[#35D07F] group-hover:shadow-[0_0_20px_rgba(53,208,127,0.2)] difficulty-card">
                      <ImageIcon className="w-12 h-12 text-[#35D07F]/30 group-hover:scale-110 group-hover:text-[#35D07F] transition-all duration-700" />
                      <div className="absolute inset-0 bg-[#35D07F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <span className="text-[#35D07F] font-mono text-xs tracking-widest bg-black px-2 py-1 border border-[#35D07F]/50">IMG_0{box}.SYS</span>
                      </div>
                    </div>
                  ))}
                  {/* Fake Microphone overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-black/90 backdrop-blur-md border-2 border-[#35D07F] flex items-center justify-center shadow-[0_0_30px_#35D07F] animate-pulse difficulty-card">
                    <Mic className="w-10 h-10 text-[#35D07F]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto border-b border-[#35D07F]/20">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black mb-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">SYSTEM ARCHITECTURE</h2>
                <div className="h-1 w-32 bg-[#35D07F] mx-auto shadow-[0_0_15px_#35D07F]"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: BrainCircuit, title: "AI VISUALS", desc: "Every puzzle consists of 4 highly abstract images generated by advanced AI models to test your deduction skills." },
                  { icon: Mic, title: "VOICE CONTROL", desc: "No typing required. Hold the microphone, speak your answer into the ether, and let the Web Speech API process it." },
                  { icon: Coins, title: "CRYPTO BOUNTIES", desc: "Correct answers trigger an on-chain smart contract function, instantly rewarding your wallet with Celo tokens." }
                ].map((feature, i) => (
                  <div key={i} className="difficulty-card p-8 bg-black/60 border-2 border-[#35D07F]/20 hover:border-[#35D07F] transition-all duration-300 hover:shadow-[0_0_30px_rgba(53,208,127,0.2)] group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#35D07F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <feature.icon className="w-12 h-12 text-[#35D07F] mb-6 drop-shadow-[0_0_8px_#35D07F]" />
                    <h3 className="text-2xl font-bold mb-4 tracking-widest">{feature.title}</h3>
                    <p className="text-neutral-400 leading-relaxed font-mono text-sm">&gt; {feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(53,208,127,0.1)_0%,transparent_50%)]" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-black mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">READY TO CONNECT?</h2>
                <p className="text-xl text-[#35D07F] mb-12 font-mono tracking-widest">&gt; AWAITING PLAYER INITIALIZATION...</p>
                <button 
                  onClick={login}
                  className="gaming-btn px-12 py-6 border-2 border-[#35D07F] text-[#35D07F] font-black text-2xl hover:text-black hover:bg-[#35D07F]"
                >
                  CONNECT WALLET
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#35D07F]/20 py-8 px-6 bg-black">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-2xl font-black tracking-tighter flex items-center">
                  <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Pi</span>
                  <span className="text-[#35D07F] text-3xl drop-shadow-[0_0_12px_#35D07F] -ml-0.5 -mr-0.5">C</span>
                  <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">ipher</span>
                </div>
                <p className="text-neutral-600 font-mono text-xs tracking-[0.3em]">© 2026 // CELO NETWORK // V1.0</p>
                <div className="flex items-center gap-6 text-[#35D07F] font-mono text-xs tracking-widest uppercase">
                  <a href="#" className="hover:text-white transition-colors">[Twitter]</a>
                  <a href="#" className="hover:text-white transition-colors">[Discord]</a>
                  <a href="#" className="hover:text-white transition-colors">[Contract]</a>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
