"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "insert-your-privy-app-id-here"}
      config={{
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
