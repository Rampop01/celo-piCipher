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
              className="px-4 py-2 text-sm font-medium bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="px-5 py-2.5 text-sm font-medium bg-[#35D07F] hover:bg-[#2bb46a] text-black rounded-lg transition-colors shadow-[0_0_15px_rgba(53,208,127,0.3)]"
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

        {/* Mode Grid will go here */}
      </main>
    </div>
  );
}
