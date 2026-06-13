"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function Profile() {
  const { user, authenticated } = usePrivy();

  const mockStats = {
    rank: "NEON_VIPER",
    level: 42,
    totalBounty: "8,450 CELO",
    stagesCleared: 124,
    perfectClears: 32,
    accuracy: "94.2%"
  };

  const recentActivity = [
    { type: "STAGE_CLEARED", stage: 124, reward: "50 CELO", time: "2h ago" },
    { type: "STAGE_CLEARED", stage: 123, reward: "45 CELO", time: "5h ago" },
    { type: "PERFECT_CLEAR", stage: 122, reward: "100 CELO", time: "1d ago" },
    { type: "BOUNTY_CLAIMED", amount: "500 CELO", time: "2d ago" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <header className="flex justify-between items-center mb-12 border-b border-[#35D07F]/30 pb-6">
        <h1 className="text-3xl font-black text-[#35D07F]">OPERATIVE_PROFILE</h1>
        <Link href="/">[ RETURN_HOME ]</Link>
      </header>
    </div>
  );
}
