"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function Profile() {
  const { user, authenticated } = usePrivy();

  const mockStats = { rank: "NEON_VIPER", level: 42, totalBounty: "8,450 CELO", stagesCleared: 124, perfectClears: 32, accuracy: "94.2%" };
  const recentActivity = [
    { type: "STAGE_CLEARED", stage: 124, reward: "50 CELO", time: "2h ago" },
    { type: "PERFECT_CLEAR", stage: 122, reward: "100 CELO", time: "1d ago" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-[#35D07F]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#35D07F]/10 border border-[#35D07F] flex items-center justify-center shadow-[0_0_15px_rgba(53,208,127,0.3)]">
              <User className="w-6 h-6 text-[#35D07F]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#35D07F] tracking-widest drop-shadow-[0_0_10px_rgba(53,208,127,0.5)] uppercase">
                OPERATIVE_PROFILE
              </h1>
              <p className="text-neutral-500 text-sm">
                ID: {authenticated ? (user?.email?.address || user?.wallet?.address?.slice(0, 12) + "...") : "UNAUTHORIZED"}
              </p>
            </div>
          </div>
          <Link href="/" className="px-6 py-2 border border-[#35D07F]/50 text-[#35D07F] hover:bg-[#35D07F]/10 transition-colors">
            [ RETURN_HOME ]
          </Link>
        </header>

        {authenticated ? (
          <div>Loading stats...</div>
        ) : (
          <div className="text-center py-20 border border-neutral-800 bg-neutral-900/20">
            <Shield className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-400 mb-2">ACCESS DENIED</h2>
            <p className="text-neutral-500 mb-6">Please connect your wallet to view operative profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
