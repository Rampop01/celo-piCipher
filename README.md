# PiCipher: Secure The Celo Mainframe

PiCipher is an immersive, cyberpunk-themed puzzle game built on the Celo blockchain. Players act as rogue hackers tasked with infiltrating the Celo Mainframe by decrypting visual anomalies and uncovering the hidden word connecting them.

## 🏆 Project Overview

This project is built to demonstrate seamless integration of Celo smart contracts with modern web technologies and mobile-first MiniPay, pushing the boundaries of Web3 gaming UX.

### 🎮 How to Play
1. **Infiltrate the Mainframe**: Connect your Web3 wallet (e.g., Opera MiniPay) to register your alias and receive your on-chain Beginner Badge.
2. **Decrypt the Anomalies**: You will be presented with a set of 4 images that share a common theme. Analyze the images carefully to figure out the hidden word.
3. **Submit the Code**: Type your answer into the terminal interface or use the hands-free voice recognition system to speak your answer aloud.
4. **Strategic Bypassing**: Stuck on a tough firewall? You can use a micro-transaction (cUSD) to bypass the stage and reveal the answer, allowing you to continue your progression.
5. **Rank Up**: Clear all 50 campaign stages to maximize your rank on the global leaderboard and fully compromise the Celo Mainframe.

### ⚡ Key Features
1. **Fully On-Chain Logic:** Registrations, level progressions, and bypassing are all executed securely on the Celo blockchain via Solidity smart contracts.
2. **Audio Engine:** An integrated Web Audio API soundscape reacting to keystrokes, success events, and errors to provide a deep cyberpunk feel.
3. **Voice Override:** Experimental Web Speech API integration allowing players to solve puzzles completely hands-free via voice commands.
4. **Micro-transactions via MiniPay:** Frictionless integration of cUSD to strategically bypass tough stages. Optimized for Opera MiniPay for zero-gas sub-cent transactions.
5. **Dynamic NFTs:** Players automatically mint a Beginner Badge upon registration and dynamically update their profile as they progress through the mainframe.

### 🔮 Future Features
- **AI Image Generation:** Implementing dynamic, on-the-fly AI generation for stage images to create an infinite, unpredictable campaign.
- **Multiplayer Mode:** Cooperative and competitive hacking scenarios where players race to decrypt stages.

### 💻 Tech Stack
- **Smart Contracts:** Solidity, Hardhat
- **Frontend:** Next.js 14, TailwindCSS, Lucide Icons, Web Speech API, Web Audio API
- **Web3 Integration:** Privy, ethers.js v6, Celo Mainnet

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

The core engine of PiCipher lies in the `PicCipherGame.sol` contract. It handles state transitions, verifies players, and interfaces with the ERC20 cUSD token for micro-transactions.

- **Contract Address:** `0xa8fE1f02F2f7a6A305AEa11C0927Fa5d35949778` (Celo Mainnet)

## 🎨 Design Philosophy
PiCipher abandons the traditional "Web3 Dapp" look in favor of an immersive terminal interface. The goal is to make the player forget they are signing transactions and instead feel like they are executing shell commands against a secure firewall.

---
> *Decrypt the truth. Hack the system. Own your progress.*
