"use client";

import { PrivyProvider } from "@privy-io/react-auth";

import { celo } from "viem/chains";

export default function Providers({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    // If no App ID is provided, render a clear error overlay so the developer knows what to fix in production.
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg border-2 border-red-500 bg-red-500/10 p-8 rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <h2 className="text-2xl font-black text-red-500 mb-4">CRITICAL SYSTEM ERROR</h2>
          <p className="font-mono text-neutral-300">
            The application failed to initialize because the <span className="text-red-400 font-bold">NEXT_PUBLIC_PRIVY_APP_ID</span> environment variable is missing.
          </p>
          <div className="mt-6 p-4 bg-black/50 border border-white/10 font-mono text-sm text-neutral-400 rounded">
            If you are seeing this on Vercel or your live link, please go to your deployment settings and add the environment variable, then redeploy.
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        defaultChain: celo,
        supportedChains: [celo],
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#35D07F", // Celo Green
          logo: "https://cryptologos.cc/logos/celo-celo-logo.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
