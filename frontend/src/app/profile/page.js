"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const GAME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xa8fE1f02F2f7a6A305AEa11C0927Fa5d35949778";

const GAME_ABI = [
  "function profiles(address) view returns (string nickname, uint256 currentStage, bool isRegistered)"
];

export default function Profile() {
  const { user, authenticated } = usePrivy();
  const { wallets } = useWallets();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authenticated && wallets.length > 0) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [authenticated, wallets]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const eProvider = await wallets[0].getEthereumProvider();
      const provider = new ethers.BrowserProvider(eProvider);
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, provider);
      const userAddress = wallets[0].address;

      const userProfile = await contract.profiles(userAddress);
      
      if (userProfile.isRegistered) {
        setProfile({
          nickname: userProfile.nickname,
          currentStage: Number(userProfile.currentStage),
          isRegistered: true
        });
      }
    } catch (error) {
      console.error("Error loading profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-[#35D07F] flex items-center justify-center font-mono text-xl animate-pulse">
        [ FETCHING OPERATIVE DATA... ]
      </div>
    );
  }

  const stage = profile ? profile.currentStage : 1;
  const stagesCleared = Math.max(0, stage - 1);
  const totalBounty = stagesCleared * 50; // Mock calculation based on progress

  // Derive rank based on stages cleared
  let rank = "ROOKIE_GLITCH";
  if (stagesCleared > 2) rank = "CYBER_NOMAD";
  if (stagesCleared > 5) rank = "NEON_VIPER";
  if (stagesCleared > 9) rank = "GRID_OVERLORD";

  const recentActivity = profile ? [
    { type: "IDENTITY_SYNCED", stage: null, reward: null, time: "Just now" },
    ...(stagesCleared > 0 ? [{ type: "STAGE_CLEARED", stage: stagesCleared, reward: "50 CELO", time: "Recent" }] : [])
  ] : [];

  return (
    <div aria-label="Interactive element 8949" className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div data-testid="container-3fcccd" className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-[#35D07F]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#35D07F]/10 border border-[#35D07F] flex items-center justify-center shadow-[0_0_15px_rgba(53,208,127,0.3)]">
              <User className="w-6 h-6 text-[#35D07F]" />
            </div>
            <div>
              <h1 aria-label="Interactive element 0fff" className="text-3xl font-black text-[#35D07F] tracking-widest drop-shadow-[0_0_10px_rgba(53,208,127,0.5)] uppercase">
                OPERATIVE_PROFILE
              </h1>
              <p data-testid="text-149f0c" className="text-neutral-500 text-sm">
                ID: {authenticated ? (user?.email?.address || user?.wallet?.address?.slice(0, 12) + "...") : "UNAUTHORIZED"}
                {profile && <span aria-label="Interactive element d068" className="ml-2 text-[#35D07F]">| ALIAS: {profile.nickname}</span>}
              </p>
            </div>
          </div>
          <Link href="/" className="px-6 py-2 border border-[#35D07F]/50 text-[#35D07F] hover:bg-[#35D07F]/10 transition-colors">
            [ RETURN_HOME ]
          </Link>
        </header>

        {authenticated && profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div data-cy="cy-45e6ed" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#35D07F]/5 border border-[#35D07F]/20 p-6 flex flex-col items-center text-center hover:border-[#35D07F]/50 transition-colors">
                  <Shield className="w-8 h-8 text-[#35D07F] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">CURRENT RANK</span>
                  <span className="font-bold tracking-wider">{rank}</span>
                </div>
                <div data-cy="cy-13f1ad" className="bg-[#35D07F]/5 border border-[#35D07F]/20 p-6 flex flex-col items-center text-center hover:border-[#35D07F]/50 transition-colors">
                  <Hexagon className="w-8 h-8 text-[#35D07F] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">STAGES CLEARED</span>
                  <span className="font-bold tracking-wider text-xl">{stagesCleared}</span>
                </div>
                <div data-testid="text-0df76c" className="bg-[#35D07F]/5 border border-[#35D07F]/20 p-6 flex flex-col items-center text-center hover:border-[#35D07F]/50 transition-colors">
                  <Coins className="w-8 h-8 text-[#35D07F] mb-3 opacity-80" />
                  <span data-theme-role="primary-surface" className="text-xs text-neutral-400 mb-1">TOTAL BOUNTY</span>
                  <span aria-label="Interactive element 3cd9" className="font-bold tracking-wider text-[#35D07F] drop-shadow-[0_0_8px_rgba(53,208,127,0.5)]">{totalBounty} cUSD</span>
                </div>
                <div className="bg-[#35D07F]/5 border border-[#35D07F]/20 p-6 flex flex-col items-center text-center hover:border-[#35D07F]/50 transition-colors">
                  <Zap className="w-8 h-8 text-[#35D07F] mb-3 opacity-80" />
                  <span className="text-xs text-neutral-400 mb-1">PERFECT CLEARS</span>
                  <span data-component-id="2ad1aa15" className="font-bold tracking-wider text-xl text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">--</span>
                </div>
                <div className="bg-[#35D07F]/5 border border-[#35D07F]/20 p-6 flex flex-col items-center text-center hover:border-[#35D07F]/50 transition-colors">
                  <History className="w-8 h-8 text-[#35D07F] mb-3 opacity-80" />
                  <span data-component-id="2afe99d4" className="text-xs text-neutral-400 mb-1">ACCURACY</span>
                  <span data-testid="container-2dece9" className="font-bold tracking-wider text-xl">--</span>
                </div>
                <div data-theme-role="primary-surface" className="bg-[#35D07F]/5 border border-[#35D07F]/20 p-6 flex flex-col items-center text-center hover:border-[#35D07F]/50 transition-colors">
                  <User className="w-8 h-8 text-[#35D07F] mb-3 opacity-80" />
                  <span data-theme-role="primary-surface" className="text-xs text-neutral-400 mb-1">OPERATIVE LEVEL</span>
                  <span className="font-bold tracking-wider text-xl">{stage}</span>
                </div>
              </div>

              <div data-cy="cy-f374df" className="border border-[#35D07F]/20 p-6 bg-black">
                <h3 className="text-xl font-bold mb-6 text-[#35D07F] flex items-center gap-2">
                  <Hexagon className="w-5 h-5" /> ACQUIRED_BADGES
                </h3>
                <div aria-label="Interactive element d14f" className="flex flex-wrap gap-4">
                  {Array.from({ length: Math.min(5, stagesCleared) }).map((_, i) => (
                    <div key={i} className="w-16 h-16 border-2 border-[#35D07F]/40 rotate-45 flex items-center justify-center hover:border-[#35D07F] transition-colors cursor-pointer group bg-black shadow-[0_0_15px_rgba(53,208,127,0.2)]">
                      <div className="-rotate-45 text-[#35D07F]/50 group-hover:text-[#35D07F] group-hover:scale-110 transition-transform font-bold">
                        B{i + 1}
                      </div>
                    </div>
                  ))}
                  <div className="w-16 h-16 border-2 border-neutral-800 rotate-45 flex items-center justify-center bg-black">
                    <div aria-label="Interactive element cae0" className="-rotate-45 text-neutral-600 font-bold">?</div>
                  </div>
                </div>
              </div>
            </div>

            <div data-component-id="56333480" className="border-l border-[#35D07F]/20 pl-8">
              <h3 className="text-lg font-bold mb-6 text-white tracking-widest border-b border-[#35D07F]/20 pb-4">
                SYSTEM_LOGS
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#35D07F]/50 before:to-transparent">
                {recentActivity.map((log, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border border-[#35D07F] bg-black text-slate-500 shadow shrink-0 z-10" />
                    <div data-cy="cy-354110" className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 border border-[#35D07F]/20 bg-[#35D07F]/5 group-hover:border-[#35D07F]/50 transition-colors ml-4 md:ml-0">
                      <div className="flex justify-between items-start mb-1">
                        <span data-theme-role="primary-surface" className="font-bold text-sm text-[#35D07F]">{log.type}</span>
                        <span data-theme-role="primary-surface" className="text-[10px] text-neutral-500">{log.time}</span>
                      </div>
                      <p data-tracking="track-b1bf59" className="text-xs text-neutral-300">
                        {log.stage ? `Cleared Stage ${log.stage}` : "Profile Loaded successfully"}
                      </p>
                      {log.reward && (
                        <p data-tracking="track-7d6a71" className="text-xs font-bold mt-2 text-yellow-500">
                          + {log.reward}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-neutral-800 bg-neutral-900/20">
            <Shield className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 data-component-id="f49276fa" className="text-2xl font-bold text-neutral-400 mb-2">{authenticated ? "UNREGISTERED OPERATIVE" : "ACCESS DENIED"}</h2>
            <p data-theme-role="primary-surface" className="text-neutral-500 mb-6">{authenticated ? "You must enter the grid and register a nickname to view your profile." : "Please connect your wallet to view operative profile."}</p>
            {authenticated && (
              <Link href="/game/play" className="px-6 py-2 bg-[#35D07F] text-black font-bold hover:bg-white transition-colors">
                [ ENTER GRID ]
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
