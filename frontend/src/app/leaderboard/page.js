"use client";

import { Trophy, Medal, Hexagon, Crosshair, Cpu } from "lucide-react";
import Link from "next/link";

export default function Leaderboard() {
  const topHackers = [
    { rank: 1, alias: "NEON_VIPER", stage: 50, score: 984500, mainnet: true },
    { rank: 2, alias: "ZERO_COOL", stage: 48, score: 912000, mainnet: true },
    { rank: 3, alias: "ACID_BURN", stage: 45, score: 875400, mainnet: false },
    { rank: 4, alias: "CRASH_OVERRIDE", stage: 42, score: 810200, mainnet: true },
    { rank: 5, alias: "LORD_N1KON", stage: 39, score: 765000, mainnet: true },
    { rank: 6, alias: "PHANTOM_PHREAK", stage: 35, score: 650000, mainnet: false },
    { rank: 7, alias: "CEREAL_KILLER", stage: 31, score: 580000, mainnet: true },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-[#35D07F]/30 pb-6">
          <div className="flex items-center gap-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-black text-[#35D07F] tracking-widest drop-shadow-[0_0_10px_rgba(53,208,127,0.5)]">
              HALL OF FAME
            </h1>
          </div>
          <Link href="/" className="px-6 py-2 border border-[#35D07F]/50 text-[#35D07F] hover:bg-[#35D07F]/10 transition-colors">
            [ RETURN_HOME ]
          </Link>
        </header>

        <div className="bg-black/50 border-2 border-[#35D07F]/20 p-6 shadow-[0_0_30px_rgba(53,208,127,0.05)]">
          <div className="grid grid-cols-12 gap-4 text-xs text-[#35D07F]/70 mb-4 px-4 uppercase tracking-widest border-b border-[#35D07F]/20 pb-4">
            <div className="col-span-2">Rank</div>
            <div className="col-span-5">Hacker Alias</div>
            <div className="col-span-2 text-center">Stage</div>
            <div className="col-span-3 text-right">Bounty Score</div>
          </div>

          <div className="flex flex-col gap-3">
            {topHackers.map((hacker, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-12 gap-4 items-center p-4 border transition-all hover:scale-[1.01] ${
                  hacker.rank === 1 ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]" :
                  hacker.rank === 2 ? "border-slate-300/50 bg-slate-300/10 text-slate-300" :
                  hacker.rank === 3 ? "border-amber-700/50 bg-amber-700/10 text-amber-600" :
                  "border-[#35D07F]/20 bg-[#35D07F]/5 text-white hover:border-[#35D07F]/50"
                }`}
              >
                <div className="col-span-2 flex items-center gap-2 font-black text-xl">
                  {hacker.rank === 1 && <Medal className="w-6 h-6" />}
                  #{hacker.rank}
                </div>
                
                <div className="col-span-5 flex flex-col">
                  <span className="font-bold tracking-wider">{hacker.alias}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {hacker.mainnet ? (
                      <span className="text-[10px] px-1.5 py-0.5 border border-green-500/50 text-green-500 bg-green-500/10">ON-CHAIN</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 border border-neutral-500/50 text-neutral-500 bg-neutral-500/10">UNVERIFIED</span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex justify-center items-center gap-2 text-xl font-bold">
                  <Hexagon className="w-4 h-4 opacity-50" />
                  {hacker.stage}
                </div>

                <div className="col-span-3 text-right font-black tracking-widest flex items-center justify-end gap-2">
                  {hacker.score.toLocaleString()}
                  <Cpu className="w-4 h-4 opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
