import { Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata = {
  title: "PiCipher: Secure The Celo Mainframe",
  description: "An elite cyberpunk visual decryption puzzle game built on the Celo blockchain. Hack nodes, decrypt visual anomalies, and mint proof-of-hack NFTs with zero-gas MiniPay transactions.",
  keywords: "Celo, Web3, Blockchain Gaming, PiCipher, NFTs, Cyberpunk, Puzzle Game, MiniPay",
  openGraph: {
    title: "PiCipher - Hack The Celo Mainframe",
    description: "Infiltrate the Celo network in this immersive cyberpunk puzzle game. Decrypt visual anomalies and mint your progress on-chain.",
    url: "https://picipher.com",
    siteName: "PiCipher",
    images: [
      {
        url: "https://picipher.com/og-celo.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PiCipher: Celo Edition",
    description: "An elite cyberpunk visual decryption puzzle game built on the Celo blockchain.",
    images: ["https://picipher.com/og-celo.png"],
  },
  other: {
    "talentapp:project_verification": "9d25ab3ae17b10b809fc45ec76bd66286674724e417d199ad695eb269d7d197d0548b9c60fcecd81b55bd80ca590c04dbf8f541ab59cefd79777bb0b6f428dfc",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
