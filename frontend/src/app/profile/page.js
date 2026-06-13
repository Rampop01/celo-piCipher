"use client";
import { User, Shield, Zap, Hexagon, History, Coins } from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function Profile() {
  const { user, authenticated } = usePrivy();

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <header className="flex justify-between items-center mb-12 border-b border-[#35D07F]/30 pb-6">
        <h1 className="text-3xl font-black text-[#35D07F]">OPERATIVE_PROFILE</h1>
        <Link href="/">[ RETURN_HOME ]</Link>
      </header>
    </div>
  );
}
