# PiCipher: Secure The Celo Mainframe

PiCipher is an immersive, cyberpunk-themed puzzle game built on the Celo blockchain. Players act as rogue hackers tasked with infiltrating the Celo Mainframe by decrypting visual anomalies (AI-generated images). 

## 🏆 Hackathon Submission

This project was built to demonstrate seamless integration of Celo smart contracts with modern web technologies and mobile-first MiniPay, pushing the boundaries of Web3 gaming UX.

### Key Features
1. **Fully On-Chain Logic:** Registrations, level progressions, bypassing, and purchasing hints are all executed securely on the Celo blockchain via Solidity smart contracts.
2. **Audio Engine:** An integrated Web Audio API soundscape reacting to keystrokes, success events, and errors to provide a deep cyberpunk feel.
3. **Voice Override:** Experimental Web Speech API integration allowing players to solve puzzles completely hands-free via voice commands.
4. **Micro-transactions via MiniPay:** Frictionless integration of cUSD to strategically bypass tough stages or purchase encrypted hints. Optimized for Opera MiniPay for zero-gas sub-cent transactions.
5. **Dynamic NFTs:** Players automatically mint a Beginner Badge upon registration and dynamically update their profile as they progress through the mainframe.

### Tech Stack
- **Smart Contracts:** Solidity, Hardhat
- **Frontend:** Next.js 14, TailwindCSS, Lucide Icons, Web Speech API, Web Audio API
- **Web3 Integration:** Privy, ethers.js v6, Celo Alfajores Testnet

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Web3 Wallet (Metamask, Valora, or Opera MiniPay)

### Installation & Setup

1. **Clone & Install Dependencies**
```bash
git clone https://github.com/yourusername/picipher-celo.git
cd picipher-celo/frontend
npm install
```

2. **Run Local Server**
```bash
npm run dev
```

3. **Play!**
Navigate to `http://localhost:3000` and connect your Celo wallet to begin your infiltration.

## 📜 Smart Contract

The core engine of PiCipher lies in the `GameEngine.sol` contract. It handles state transitions, verify players, and interfaces with the ERC20 cUSD token for micro-transactions.

- **Contract Address:** `0xa8fE1f02F2f7a6A305AEa11C0927Fa5d35949778` (Celo Alfajores)

## 🎨 Design Philosophy
PiCipher abandons the traditional "Web3 Dapp" look in favor of an immersive terminal interface. The goal is to make the player forget they are signing transactions and instead feel like they are executing shell commands against a secure firewall.

---
> *Decrypt the truth. Hack the system. Own your progress.*
