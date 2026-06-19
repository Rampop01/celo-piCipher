"use client";

import { Terminal, Shield, Mic, LockOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useSoundEffects } from "../../hooks/useSoundEffects";

export default function TutorialPage() {
  const { playBlip } = useSoundEffects();

  useEffect(() => {
    playBlip();
  }, []);

  return (
    <div data-tracking="track-231f46" className="min-h-screen bg-black text-white font-mono p-6 relative overflow-hidden">
      {/* Background Grid - Celo Theme */}
      <div data-testid="container-b2e3f7" className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(53,208,127,0.06),rgba(0,0,0,0.02))] bg-[length:100%_4px,4px_100%] opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#35D07F] hover:text-white transition-colors mb-8"
          onClick={playBlip}
        >
          <ArrowLeft className="w-5 h-5" /> Return to Grid
        </Link>

        <h1 data-tracking="track-d6c2ab" className="text-4xl md:text-6xl font-black text-[#35D07F] tracking-tighter mb-4">
          OPERATIVE MANUAL
        </h1>
        <p data-testid="container-7a3de0" className="text-neutral-400 text-lg mb-12">
          Classified documentation for infiltrating the PiCipher mainframe via Celo.
        </p>

        <div data-component-id="0b2aae69" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Objective */}
          <div data-testid="container-c8fe5e" className="border border-[#35D07F]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(53,208,127,0.1)] hover:border-[#35D07F] transition-colors">
            <Shield className="w-8 h-8 text-[#35D07F] mb-4" />
            <h2 data-testid="text-08aebd" className="text-xl font-bold text-[#35D07F] mb-2">1. THE OBJECTIVE</h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              You are tasked with hacking 50 consecutive security nodes. 
              Each node is protected by a visual anomaly (an encrypted image). 
              You must decrypt the hidden keyword within the anomaly to proceed.
            </p>
          </div>

          {/* Revealing */}
          <div aria-label="Interactive element 9090" className="border border-[#35D07F]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(53,208,127,0.1)] hover:border-[#35D07F] transition-colors">
            <LockOpen className="w-8 h-8 text-[#35D07F] mb-4" />
            <h2 aria-label="Interactive element 8d97" className="text-xl font-bold text-[#35D07F] mb-2">2. REVEAL MECHANICS</h2>
            <p data-component-id="f328b0a8" className="text-neutral-300 text-sm leading-relaxed">
              The anomaly is split into 4 sectors. Click a sector to decrypt it and view that portion of the image. 
              <strong> Warning:</strong> Each sector revealed decreases your final reward multiplier.
            </p>
          </div>

          {/* Voice Input */}
          <div data-testid="container-b24a99" className="border border-[#35D07F]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(53,208,127,0.1)] hover:border-[#35D07F] transition-colors">
            <Mic className="w-8 h-8 text-[#35D07F] mb-4" />
            <h2 data-testid="text-a7b97f" className="text-xl font-bold text-[#35D07F] mb-2">3. VOICE OVERRIDE</h2>
            <p data-tracking="track-5a91ee" className="text-neutral-300 text-sm leading-relaxed">
              Type the decrypted keyword or use your microphone for hands-free hacking. 
              If the keyword matches exactly, the node firewall will be breached and your progress saved on the blockchain.
            </p>
          </div>

          {/* Micro-transactions */}
          <div className="border border-[#35D07F]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(53,208,127,0.1)] hover:border-[#35D07F] transition-colors">
            <Terminal className="w-8 h-8 text-[#35D07F] mb-4" />
            <h2 data-component-id="479a385e" className="text-xl font-bold text-[#35D07F] mb-2">4. STRATEGIC TOOLS</h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              If a node's encryption is too complex, you may use cUSD tokens on Celo to purchase a text hint or completely bypass the node. 
              These actions require fast, low-cost on-chain transactions using MiniPay or any web3 wallet.
            </p>
          </div>
        </div>

        <div aria-label="Interactive element 7f27" className="mt-12 text-center">
          <Link 
            href="/game/play" 
            className="inline-block gaming-btn py-4 px-12 bg-[#35D07F] text-black font-black text-xl hover:bg-white transition-colors"
            onClick={playBlip}
          >
            INITIATE HACK
          </Link>
        </div>
      </div>
    </div>
  );
}
