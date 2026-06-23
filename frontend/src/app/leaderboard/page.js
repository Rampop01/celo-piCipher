"use client";

import { Trophy, Medal, Hexagon, Crosshair, Cpu, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";

const GAME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x511eb648f6946bFEED42014c6D95AeCa97cB03eA";

const GAME_ABI = [
  "function nextTokenId() view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function profiles(address) view returns (string nickname, uint256 currentStage, bool isRegistered)"
];

const fallbackHackers = [
  { rank: 1, alias: "NEON_VIPER", stage: 50, score: 984500, mainnet: true },
  { rank: 2, alias: "ZERO_COOL", stage: 48, score: 912000, mainnet: true },
  { rank: 3, alias: "ACID_BURN", stage: 45, score: 875400, mainnet: false },
  { rank: 4, alias: "CRASH_OVERRIDE", stage: 42, score: 810200, mainnet: true },
  { rank: 5, alias: "LORD_N1KON", stage: 39, score: 765000, mainnet: true },
  { rank: 6, alias: "PHANTOM_PHREAK", stage: 35, score: 650000, mainnet: false },
  { rank: 7, alias: "CEREAL_KILLER", stage: 31, score: 580000, mainnet: true },
];

const CYBER_NAMES = [
  "NEON_VIPER", "ZERO_COOL", "ACID_BURN", "CRASH_OVERRIDE", "LORD_N1KON", 
  "PHANTOM_PHREAK", "CEREAL_KILLER", "CYBER_PUNK", "GLITCH_RIPPER", "SYNTH_WAVE",
  "NEUROMANCER", "WINTERMUTE", "DARK_MATTER", "GHOST_SHELL", "VOID_WALKER", 
  "CYPHER", "TRINITY", "MORPHEUS", "DATA_GHOST", "CHROMED_OUT"
];

export default function Leaderboard() {
  const { wallets } = useWallets();
  const [topHackers, setTopHackers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [wallets]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      // Always use the public Celo RPC for reading data so it doesn't fail 
      // if the user's wallet is connected to the wrong network.
      const provider = new ethers.JsonRpcProvider("https://forno.celo.org");

      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, provider);
      
      // Instead of using getLogs (which has a 5000 block range limit on Celo RPCs),
      // we iterate through nextTokenId to find all owners, then get their profiles.
      const nextTokenId = await contract.nextTokenId();
      const totalTokens = Number(nextTokenId) - 1;

      if (totalTokens === 0) {
        setTopHackers(fallbackHackers);
        setIsLoading(false);
        return;
      }

      // 1. Fetch all unique player addresses by iterating token owners
      const owners = [];
      const batchSize = 50; // Batch requests to prevent rate limiting
      for (let i = 1; i <= totalTokens; i += batchSize) {
        const batchPromises = [];
        for (let j = i; j < i + batchSize && j <= totalTokens; j++) {
          batchPromises.push(contract.ownerOf(j).catch(() => null));
        }
        const batch = await Promise.all(batchPromises);
        owners.push(...batch);
      }

      const uniquePlayers = {};
      owners.forEach(addr => {
        if (addr && !uniquePlayers[addr]) {
          uniquePlayers[addr] = true;
        }
      });

      const playerAddresses = Object.keys(uniquePlayers);
      
      // 2. Query profiles for each unique address in batches
      const profilesData = [];
      for (let i = 0; i < playerAddresses.length; i += batchSize) {
        const batchPromises = playerAddresses.slice(i, i + batchSize).map(addr => 
          contract.profiles(addr).catch(() => null)
        );
        const batch = await Promise.all(batchPromises);
        profilesData.push(...batch);
      }

      const hackersList = [];
      
      for (let i = 0; i < playerAddresses.length; i++) {
        const data = profilesData[i];
        if (data && data.isRegistered) {
          const stage = Number(data.currentStage);
          const score = (stage - 1) * 10;
          
          let alias = data.nickname;
          if (alias.toLowerCase().startsWith("hacker_")) {
            const numStr = alias.split("_")[1] || "0";
            const num = parseInt(numStr, 10);
            if (!isNaN(num)) {
              // Deterministically mask the bot name
              const baseName = CYBER_NAMES[num % CYBER_NAMES.length];
              const hexSuffix = (num * 123).toString(16).toUpperCase().padStart(2, '0');
              alias = `${baseName}_${hexSuffix}`;
            }
          }
          
          hackersList.push({
            alias: alias,
            stage: stage,
            score: score,
            mainnet: true,
            address: playerAddresses[i]
          });
        }
      }

      // Sort and Rank
      hackersList.sort((a, b) => b.score - a.score);
      
      hackersList.forEach((h, i) => {
        h.rank = i + 1;
      });
      
      const rankedHackers = hackersList.slice(0, 10);

      const currentUserAddress = wallets?.[0]?.address?.toLowerCase();
      if (currentUserAddress) {
        const userInTop50 = rankedHackers.find(h => h.address?.toLowerCase() === currentUserAddress);
        if (!userInTop50) {
          const userFullProfile = hackersList.find(h => h.address?.toLowerCase() === currentUserAddress);
          if (userFullProfile) {
            // Add a visual separator flag if needed, but we just append them
            userFullProfile.isAppended = true; 
            rankedHackers.push(userFullProfile);
          }
        }
      }

      setTopHackers(rankedHackers.length > 0 ? rankedHackers : fallbackHackers);

    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      // Fallback if RPC rate-limited or fails
      setTopHackers(fallbackHackers);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-component-id="d93c0365" className="min-h-screen bg-black text-white p-6 md:p-12 font-mono pb-24">
      <div data-theme-role="primary-surface" className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#35D07F]/30 pb-4 md:pb-6">
          <div data-testid="container-b5d182" className="flex items-center gap-2 md:gap-4">
            <Trophy className="w-6 h-6 md:w-10 md:h-10 text-yellow-500" />
            <h1 data-theme-role="primary-surface" className="text-2xl md:text-4xl font-black text-[#35D07F] tracking-widest drop-shadow-[0_0_10px_rgba(53,208,127,0.5)]">
              HALL OF FAME
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchLeaderboard} className="p-2 text-[#35D07F]/70 hover:text-[#35D07F] hover:rotate-180 transition-all duration-500">
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-[#35D07F]' : ''}`} />
            </button>
            <Link href="/" className="px-6 py-2 border border-[#35D07F]/50 text-[#35D07F] hover:bg-[#35D07F]/10 transition-colors hidden md:block">
              [ RETURN_HOME ]
            </Link>
          </div>
        </header>

        <div aria-label="Interactive element 7b1f" className="bg-black/50 border-2 border-[#35D07F]/20 p-6 shadow-[0_0_30px_rgba(53,208,127,0.05)] relative min-h-[400px]">
          
          <div data-testid="container-59b6a5" className="grid grid-cols-12 gap-2 md:gap-4 text-[10px] md:text-xs text-[#35D07F]/70 mb-4 px-2 md:px-4 uppercase tracking-widest border-b border-[#35D07F]/20 pb-4">
            <div data-tracking="track-e910fd" className="col-span-2 md:col-span-2">Rank</div>
            <div data-testid="text-42ca1a" className="col-span-5 md:col-span-5">Hacker Alias</div>
            <div data-testid="container-0f4fa7" className="col-span-2 md:col-span-2 text-center">Stage</div>
            <div data-testid="container-1dd53c" className="col-span-3 md:col-span-3 text-right">XP</div>
          </div>

          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
              <Loader2 className="w-12 h-12 text-[#35D07F] animate-spin mb-4" />
              <div className="text-[#35D07F] font-mono animate-pulse tracking-widest text-sm">[ FETCHING_LIVE_DATA ]</div>
            </div>
          ) : (
            <div data-testid="container-a10fb3" className="flex flex-col gap-3">
              {topHackers.map((hacker, i) => {
                const isCurrentUser = wallets?.[0]?.address?.toLowerCase() === hacker.address?.toLowerCase();
                
                return (
                  <div 
                    key={i} 
                    className={`grid grid-cols-12 gap-2 md:gap-4 items-center p-3 md:p-4 border transition-all hover:scale-[1.01] ${
                      isCurrentUser ? "border-[#35D07F] bg-[#35D07F]/20 text-white shadow-[0_0_20px_rgba(53,208,127,0.3)] z-10 relative" :
                      hacker.rank === 1 ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]" :
                      hacker.rank === 2 ? "border-slate-300/50 bg-slate-300/10 text-slate-300" :
                      hacker.rank === 3 ? "border-amber-700/50 bg-amber-700/10 text-amber-600" :
                      "border-[#35D07F]/20 bg-[#35D07F]/5 text-white hover:border-[#35D07F]/50"
                    }`}
                  >
                    <div data-testid="container-8c93e7" className="col-span-2 md:col-span-2 flex items-center gap-1 md:gap-2 font-black text-sm md:text-xl">
                      {hacker.rank === 1 && <Medal className="w-4 h-4 md:w-6 md:h-6" />}
                      #{hacker.rank}
                    </div>
                    
                    <div aria-label="Interactive element 0f3d" className="col-span-5 md:col-span-5 flex flex-col">
                      <span data-theme-role="primary-surface" className="font-bold tracking-wider text-xs md:text-base truncate">
                        {hacker.alias} {isCurrentUser && " (YOU)"}
                      </span>
                      <div aria-label="Interactive element 5c76" className="flex items-center gap-2 mt-1">
                        {hacker.mainnet ? (
                          <span data-cy="cy-308f98" className="text-[8px] md:text-[10px] px-1.5 py-0.5 border border-green-500/50 text-green-500 bg-green-500/10 hidden md:inline-block">ON-CHAIN</span>
                        ) : (
                          <span data-component-id="ec3a0403" className="text-[8px] md:text-[10px] px-1.5 py-0.5 border border-neutral-500/50 text-neutral-500 bg-neutral-500/10 hidden md:inline-block">UNVERIFIED</span>
                        )}
                      </div>
                    </div>

                    <div data-testid="text-51866f" className="col-span-2 md:col-span-2 flex justify-center items-center gap-1 md:gap-2 text-xs md:text-xl font-bold">
                      <Hexagon className="w-3 h-3 md:w-4 md:h-4 opacity-50 hidden md:block" />
                      {hacker.stage > 50 ? (
                        <span className="text-[8px] md:text-xs text-yellow-500 border border-yellow-500/50 bg-yellow-500/10 px-1 py-0.5 whitespace-nowrap hidden sm:inline">COMPLETED</span>
                      ) : null}
                      {hacker.stage > 50 ? (
                        <span className="text-[10px] text-yellow-500 sm:hidden">MAX</span>
                      ) : (
                        hacker.stage
                      )}
                    </div>

                    <div data-testid="container-316e86" className="col-span-3 md:col-span-3 text-right font-black tracking-widest flex items-center justify-end gap-1 md:gap-2 text-xs md:text-base">
                      {hacker.score.toLocaleString()}
                      <Cpu className="w-3 h-3 md:w-4 md:h-4 opacity-50 hidden md:block" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <Link href="/" className="mt-8 px-6 py-4 border border-[#35D07F]/50 text-[#35D07F] hover:bg-[#35D07F]/10 transition-colors block text-center md:hidden tracking-widest font-bold">
          [ RETURN_HOME ]
        </Link>
      </div>
    </div>
  );
}
