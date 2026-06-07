"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { Mic, BrainCircuit, Coins, Trophy, Image as ImageIcon, Zap } from "lucide-react";

export default function Home() {
  const { login, authenticated, user, logout } = usePrivy();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            <div className="text-3xl font-black tracking-tighter flex items-center font-orbitron">
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
                <button 
                  onClick={logout}
                  className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/60 hover:bg-white/10 transition-all text-sm font-bold tracking-wider"
                >
                  DISCONNECT
                </button>
              </>
            ) : (
              <button 
                onClick={login}
                className="group relative px-8 py-3 rounded-full bg-[#35D07F] text-black font-bold uppercase tracking-wider overflow-hidden hover:scale-105 transition-transform shadow-[0_0_20px_rgba(53,208,127,0.3)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Play Now</span>
              </button>
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
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 mb-6 font-orbitron">
                  CHOOSE YOUR DIFFICULTY
                </h2>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                  Higher difficulties require you to guess the word using fewer images, but reward exponentially higher bounties.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                {[
                  { mode: 1, title: "EXPERT", pics: 1, desc: "Only 1 image revealed. Master level deduction required.", color: "from-red-500 to-rose-900", border: "hover:border-red-500/50" },
                  { mode: 2, title: "HARD", pics: 2, desc: "2 images revealed. High risk, high reward.", color: "from-orange-500 to-amber-900", border: "hover:border-orange-500/50" },
                  { mode: 3, title: "NORMAL", pics: 3, desc: "3 images revealed. The standard experience.", color: "from-blue-500 to-indigo-900", border: "hover:border-blue-500/50" },
                  { mode: 4, title: "EASY", pics: 4, desc: "All 4 images revealed. Minimal risk.", color: "from-[#35D07F] to-[#1e9a58]", border: "hover:border-[#35D07F]/50" },
                ].map((m) => (
                  <button
                    key={m.mode}
                    className={`relative group p-8 rounded-3xl bg-white/5 border border-white/10 ${m.border} transition-all duration-300 hover:-translate-y-2 text-left flex flex-col h-80 overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="flex-1">
                      <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br ${m.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                        0{m.pics}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-4 font-orbitron">{m.title}</h3>
                      <p className="text-neutral-400 mt-2 leading-relaxed">{m.desc}</p>
                    </div>
                    
                    <div className="mt-auto flex items-center gap-2 text-sm font-bold tracking-wider uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                      Select Mode &rarr;
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          /* Unauth State: Full Landing Page */
          <>
            {/* Hero Section */}
            <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="w-2 h-2 rounded-full bg-[#35D07F] animate-pulse"></span>
                <span className="text-sm font-medium tracking-wide">Built on Celo Network</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 max-w-5xl">
                SEE THE CODE.<br/>SPEAK THE TRUTH.
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                PiCipher is a revolutionary Web3 puzzle experience. Decode AI-generated visual connections and use your voice to claim crypto bounties.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <button 
                  onClick={login}
                  className="px-10 py-5 rounded-full bg-[#35D07F] text-black font-black text-xl tracking-wider hover:scale-105 hover:shadow-[0_0_30px_rgba(53,208,127,0.4)] transition-all duration-300"
                >
                  START DECRYPTING
                </button>
                <a href="#how-it-works" className="px-10 py-5 rounded-full border border-white/20 text-white font-bold text-xl tracking-wider hover:bg-white/10 transition-all duration-300">
                  LEARN MORE
                </a>
              </div>
            </section>

            {/* Interactive Preview Section */}
            <section className="py-24 px-6 relative border-y border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                  <h2 className="text-4xl md:text-5xl font-black font-orbitron">THE ULTIMATE TEST OF PERCEPTION</h2>
                  <p className="text-lg text-neutral-400 leading-relaxed">
                    You are presented with 4 seemingly random AI-generated images. They all share one conceptual link. Can you find it?
                    The catch: revealing fewer images rewards you with a significantly higher multiplier on your Celo bounty.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Dynamic AI generation means no two puzzles are alike.",
                      "Smart contract verification ensures provably fair rewards.",
                      "Real-time voice recognition for instant, seamless answers."
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-[#35D07F]/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#35D07F]"></div>
                        </div>
                        <span className="text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Visual Mockup */}
                <div className="flex-1 w-full max-w-lg aspect-square grid grid-cols-2 gap-4 group perspective-1000">
                  {[1, 2, 3, 4].map((box) => (
                    <div key={box} className="bg-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:border-[#35D07F]/50 group-hover:shadow-[0_0_20px_rgba(53,208,127,0.1)]">
                      <ImageIcon className="w-12 h-12 text-neutral-700 group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <span className="text-[#35D07F] font-mono text-sm">IMAGE_0{box}.JPG</span>
                      </div>
                    </div>
                  ))}
                  {/* Fake Microphone overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-black/80 backdrop-blur-xl border border-[#35D07F] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(53,208,127,0.3)] animate-pulse">
                    <Mic className="w-10 h-10 text-[#35D07F]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black mb-6 font-orbitron">POWERED BY NEXT-GEN TECH</h2>
                <p className="text-neutral-400 text-xl max-w-2xl mx-auto">Seamlessly bridging Web3 infrastructure with cutting edge AI and Voice recognition.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: BrainCircuit, title: "AI Visuals", desc: "Every puzzle consists of 4 highly abstract images generated by advanced AI models to test your deduction skills." },
                  { icon: Mic, title: "Voice Control", desc: "No typing required. Hold the microphone, speak your answer into the ether, and let the Web Speech API process it." },
                  { icon: Coins, title: "Crypto Bounties", desc: "Correct answers trigger an on-chain smart contract function, instantly rewarding your wallet with Celo tokens." }
                ].map((feature, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#35D07F]/30 transition-all duration-300">
                    <feature.icon className="w-12 h-12 text-[#35D07F] mb-6" />
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#35D07F]/5 blur-[100px] rounded-full max-w-4xl mx-auto" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-black mb-8 font-orbitron">READY TO PLAY?</h2>
                <p className="text-xl text-neutral-400 mb-12">Join thousands of players decrypting the visual web. Connect your wallet to begin your first puzzle.</p>
                <button 
                  onClick={login}
                  className="px-12 py-6 rounded-full bg-white text-black font-black text-2xl tracking-wider hover:scale-105 hover:bg-[#35D07F] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(53,208,127,0.5)]"
                >
                  CONNECT WALLET
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-2xl font-black tracking-tighter flex items-center font-orbitron">
                  <span className="text-white">Pi</span>
                  <span className="text-[#35D07F] text-3xl -ml-0.5 -mr-0.5">C</span>
                  <span className="text-white">ipher</span>
                </div>
                <p className="text-neutral-500 font-mono text-sm">© 2026 PiCipher. Deployed on Celo Network.</p>
                <div className="flex items-center gap-6 text-neutral-500">
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">Discord</a>
                  <a href="#" className="hover:text-white transition-colors">Contract</a>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
