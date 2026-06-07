"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { login, authenticated, user, logout } = usePrivy();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans">
      <header className="flex items-center justify-between p-6 border-b border-neutral-800">
        <h1 className="text-2xl font-bold tracking-tight text-[#35D07F]">PicCipher</h1>
        
        {authenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">
              {user?.email?.address || user?.wallet?.address?.slice(0,6) + '...'}
            </span>
            <button 
              onClick={logout}
              className="gaming-btn px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="gaming-btn px-6 py-2.5 text-sm bg-[#35D07F] text-black rounded-lg"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-12 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Select Your Challenge
        </h2>
        <p className="text-neutral-400 text-center max-w-lg mb-12 text-lg">
          Guess the hidden word from the AI-generated images. The more images you reveal, the fewer points you earn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
          {[
            { mode: 1, title: "Expert Mode", pics: 1, desc: "Guess from 1 picture. Max points.", color: "from-[#35D07F] to-[#1e9a58]" },
            { mode: 2, title: "Hard Mode", pics: 2, desc: "Guess from 2 pictures.", color: "from-[#4CAF50] to-[#2E7D32]" },
            { mode: 3, title: "Normal Mode", pics: 3, desc: "Guess from 3 pictures.", color: "from-[#81C784] to-[#388E3C]" },
            { mode: 4, title: "Easy Mode", pics: 4, desc: "Guess from 4 pictures. Minimum points.", color: "from-[#A5D6A7] to-[#4CAF50]" },
          ].map((m) => (
            <button
              key={m.mode}
              className="gaming-btn neon-border relative overflow-hidden group p-1 rounded-2xl text-left"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
              <div className="relative h-full bg-neutral-900/80 backdrop-blur p-8 rounded-xl flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${m.color} text-black font-bold shadow-[0_0_10px_currentColor]`}>
                    {m.pics}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-widest">{m.title}</h3>
                </div>
                <p className="text-neutral-400 text-sm font-sans tracking-normal">{m.desc}</p>
                <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#35D07F] group-hover:text-white transition-colors">
                  Play Now &gt;&gt;&gt;
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
