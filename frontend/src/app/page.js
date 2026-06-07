"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export default function Home() {
  const { login, authenticated, user, logout } = usePrivy();
  const [glitchText, setGlitchText] = useState("PIC CIPHER");

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText((prev) => (prev === "PIC CIPHER" ? "P!C C1PH3R" : "PIC CIPHER"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-orbitron relative overflow-hidden flex flex-col">
      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

      <header className="relative z-10 flex items-center justify-between p-6 border-b border-[#35D07F]/20 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3 select-none cursor-pointer group">
          <div className="w-3 h-3 bg-[#35D07F] animate-pulse rounded-full shadow-[0_0_10px_#35D07F] group-hover:scale-125 transition-transform"></div>
          <div className="text-2xl font-black tracking-tighter flex items-center">
            <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Pi</span>
            <span className="text-[#35D07F] text-3xl drop-shadow-[0_0_12px_#35D07F] -ml-0.5 -mr-0.5">C</span>
            <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">ipher</span>
          </div>
        </div>
        
        {authenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#35D07F] tracking-widest border border-[#35D07F]/30 px-3 py-1 rounded bg-[#35D07F]/10">
              PLAYER: {user?.email?.address || user?.wallet?.address?.slice(0,6) + '...'}
            </span>
            <button 
              onClick={logout}
              className="gaming-btn px-4 py-2 text-xs bg-red-900/40 hover:bg-red-600 border border-red-500/50 rounded text-white tracking-widest shadow-[0_0_10px_rgba(255,0,0,0.2)]"
            >
              [ DISCONNECT ]
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6">
        
        {!authenticated ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#35D07F] to-[#1e9a58] drop-shadow-[0_0_25px_rgba(53,208,127,0.4)] glitch-effect">
              {glitchText}
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl tracking-widest uppercase max-w-2xl leading-relaxed">
              Decrypt the AI visuals. <br/> Speak the hidden word. <br/> Claim the bounty.
            </p>
            <div className="pt-8">
              <button 
                onClick={login}
                className="group relative px-8 py-4 bg-transparent border-2 border-[#35D07F] text-[#35D07F] font-bold text-xl md:text-2xl tracking-[0.2em] uppercase overflow-hidden hover:text-black transition-colors duration-300 shadow-[0_0_20px_rgba(53,208,127,0.3),inset_0_0_20px_rgba(53,208,127,0.1)]"
              >
                <div className="absolute inset-0 bg-[#35D07F] w-0 group-hover:w-full transition-all duration-300 ease-out -z-10"></div>
                &gt; Press Start to Connect &lt;
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 min-h-[60vh] flex flex-col justify-center">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                Select Difficulty
              </h2>
              <div className="h-1 w-32 bg-[#35D07F] mx-auto mt-6 shadow-[0_0_15px_#35D07F]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {[
                { mode: 1, title: "EXPERT", pics: 1, desc: "1 PIC. MAX BOUNTY.", color: "from-[#ff003c] to-[#8a0020]", border: "border-[#ff003c]", glow: "shadow-[0_0_20px_rgba(255,0,60,0.3)]" },
                { mode: 2, title: "HARD", pics: 2, desc: "2 PICS. HIGH REWARD.", color: "from-[#ff8a00] to-[#995300]", border: "border-[#ff8a00]", glow: "shadow-[0_0_20px_rgba(255,138,0,0.3)]" },
                { mode: 3, title: "NORMAL", pics: 3, desc: "3 PICS. STANDARD.", color: "from-[#00b8ff] to-[#006e99]", border: "border-[#00b8ff]", glow: "shadow-[0_0_20px_rgba(0,184,255,0.3)]" },
                { mode: 4, title: "EASY", pics: 4, desc: "4 PICS. MINIMUM.", color: "from-[#35D07F] to-[#1e9a58]", border: "border-[#35D07F]", glow: "shadow-[0_0_20px_rgba(53,208,127,0.3)]" },
              ].map((m) => (
                <button
                  key={m.mode}
                  className={`gaming-btn relative overflow-hidden group p-6 bg-black/60 backdrop-blur border ${m.border} ${m.glow} hover:shadow-[0_0_30px_currentColor] text-left flex flex-col items-center justify-center text-center h-64`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${m.color} opacity-10 group-hover:opacity-30 transition-opacity`} />
                  
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <span className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b ${m.color} drop-shadow-[0_0_10px_currentColor]`}>
                      0{m.pics}
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-widest mt-2">{m.title}</h3>
                    <p className="text-neutral-400 text-xs tracking-widest">{m.desc}</p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-4 py-1 border border-white/50 text-white text-xs uppercase tracking-[0.3em] bg-white/10">
                        Select
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* How to Play Section */}
      {!authenticated && (
        <section className="relative z-10 border-t border-[#35D07F]/20 bg-black/80 backdrop-blur-md py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-16">
              SYSTEM_TUTORIAL
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "ANALYZE", desc: "Examine AI-generated visuals. Fewer pictures revealed equals higher crypto bounties." },
                { step: "02", title: "DECRYPT", desc: "Deduce the hidden connection between the abstract images provided by the system." },
                { step: "03", title: "TRANSMIT", desc: "Use voice recognition to speak the hidden word directly into the terminal." }
              ].map((s) => (
                <div key={s.step} className="relative group p-8 border border-neutral-800 bg-neutral-900/50 hover:border-[#35D07F]/50 transition-colors">
                  <div className="absolute -top-6 -left-6 text-7xl font-black text-neutral-800 group-hover:text-[#35D07F]/20 transition-colors z-0">
                    {s.step}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white tracking-widest mb-4">{s.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed tracking-wider font-sans">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-800 bg-black py-8 text-center text-xs tracking-[0.3em] text-neutral-600">
        <p>PIC CIPHER v1.0.0 // CELO NETWORK // END OF TRANSMISSION</p>
      </footer>
    </div>
  );
}
