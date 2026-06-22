"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mic, MicOff, AlertCircle, Play, FastForward, CheckCircle2, Lock, Home, Trophy, User } from "lucide-react";
import { ethers } from "ethers";
import { GAME_VAULTS } from "../../../data/vault";
import { useSoundEffects } from "../../../hooks/useSoundEffects";
import VictoryScreen from "../../../components/VictoryScreen";
import OnboardingOverlay from "../../../components/OnboardingOverlay";
import TiltCard from "../../../components/TiltCard";

// Contract Addresses
const GAME_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xa8fE1f02F2f7a6A305AEa11C0927Fa5d35949778";
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

// Simplified ABIs
const GAME_ABI = [
  "function profiles(address) view returns (string nickname, uint256 currentStage, bool isRegistered)",
  "function registerUser(string calldata _nickname) external",
  "function submitStageAnswer(string calldata _answer) external",
  "function bypassStage() external",
  "function buyHint() external",
  "function bypassFee() view returns (uint256)",
  "function hintFee() view returns (uint256)"
];
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

export default function GamePlay() {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const { playBlip, playKeystroke, playSuccess, playError, playUnlock } = useSoundEffects();

  // State
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nicknameInput, setNicknameInput] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStageData, setCurrentStageData] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [revealedImages, setRevealedImages] = useState([true, false, false, false]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [difficulty, setDifficulty] = useState("EASY"); // EASY, MEDIUM, HARD
  const [category, setCategory] = useState("CAMPAIGN"); // CAMPAIGN, CYBERPUNK, GAMING
  const [viewingStage, setViewingStage] = useState(1);

  // Refs
  const recognitionRef = useRef(null);
  const hasWelcomedRef = useRef(false);

  // Reset welcome when active user changes
  useEffect(() => {
    hasWelcomedRef.current = false;
  }, [user?.wallet?.address]);

  // 1. Detect MiniPay & Load Profile
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
      setIsMiniPay(true);
    }
    if (authenticated && wallets.length > 0) {
      loadProfile();
    } else if (authenticated && wallets.length === 0) {
      // Email user: embedded wallet may still be initializing.
      // Set a timeout so we don't hang forever.
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setProfile({ isRegistered: false });
      }, 8000);
      return () => clearTimeout(timeout);
    } else if (!authenticated) {
      router.push("/");
    }

    if (typeof window !== "undefined") {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [authenticated, wallets]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  // Helper: get the active wallet for the current user session
  const getActiveWallet = () => {
    return wallets.find(w => w.address === user?.wallet?.address) || wallets[0] || null;
  };

  // Load user profile from contract
  const loadProfile = async () => {
    try {
      setIsLoading(true);
      // Use public RPC for read-only calls so it works even if the wallet has no CELO
      const provider = new ethers.JsonRpcProvider("https://forno.celo.org");
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, provider);
      // Resolve the active wallet address for the current user session
      const activeWallet = getActiveWallet();
      if (!activeWallet) {
        // Check for off-chain nickname in localStorage
        const localNickname = localStorage.getItem("picipher_nickname");
        if (localNickname) {
          setProfile({
            nickname: localNickname,
            currentStage: 1, // Start at stage 1 for off-chain users
            isRegistered: true,
            isOffChain: true
          });
          setViewingStage(1);
          loadStage(1, "CAMPAIGN", difficulty);
        } else {
          setProfile({ isRegistered: false });
        }
        setIsLoading(false);
        return;
      }
      const userAddress = activeWallet.address;

      const userProfile = await contract.profiles(userAddress);
      
      if (userProfile.isRegistered) {
        const stageNum = Number(userProfile.currentStage);
        setProfile({
          nickname: userProfile.nickname,
          currentStage: stageNum,
          isRegistered: true
        });
        setViewingStage(stageNum);
        loadStage(stageNum, "CAMPAIGN", difficulty);
        if (!hasWelcomedRef.current) {
          speakText(`Welcome back to the grid, ${userProfile.nickname}.`);
          hasWelcomedRef.current = true;
        }
      } else {
        setProfile({ isRegistered: false });
        speakText("Unregistered identity detected. Please register a nickname.");
      }
    } catch (error) {
      console.error("Error loading profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStage = (stageId, cat = category, diff = difficulty) => {
    const vault = GAME_VAULTS[cat];
    const stage = vault.find(s => s.stageId === stageId);
    if (stage) {
      setCurrentStageData(stage);
      setShowHint(false);
      setTranscript("");
      setFeedback({ type: "", message: "" });
      
      let initRevealed = [true, false, false, false];
      if (diff === "MEDIUM") initRevealed = [true, true, false, false];
      if (diff === "EASY") initRevealed = [true, true, true, true];
      
      setRevealedImages(initRevealed);
      setViewingStage(stageId);
      setCategory(cat);
      setDifficulty(diff);
    } else {
      if (cat === "CAMPAIGN") {
        setCurrentStageData({ isComplete: true });
        speakText("Incredible. You have bypassed all security protocols. Campaign completed.");
      } else {
        // Loop back to start for free play categories
        loadStage(1, cat, diff);
      }
    }
  };

  const handlePrevStage = () => {
    if (viewingStage > 1) {
      loadStage(viewingStage - 1, category, difficulty);
    }
  };

  const handleNextStage = () => {
    if (category !== "CAMPAIGN" || viewingStage < profile?.currentStage) {
      loadStage(viewingStage + 1, category, difficulty);
    }
  };

  // AI Voice Guide
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a robotic/cyberpunk voice
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google")) || voices[0];
      utterance.voice = engVoice;
      utterance.pitch = 0.8;
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const revealImage = (index) => {
    if (revealedImages[index]) return;
    playBlip();
    const newRevealed = [...revealedImages];
    newRevealed[index] = true;
    setRevealedImages(newRevealed);
    speakText(`Decrypting visual anomaly 0${index + 1}. Reward multiplier decreased.`);
  };

  // Register User
  const handleRegister = async () => {
    if (!nicknameInput) return;
    
    const activeWallet = getActiveWallet();
    
    // If no wallet available (email-only user), save nickname locally
    if (!activeWallet) {
      setIsRegistering(true);
      setFeedback({ type: "loading", message: "Initializing identity..." });
      
      // Save nickname to localStorage for off-chain play
      localStorage.setItem("picipher_nickname", nicknameInput);
      
      setTimeout(() => {
        playSuccess();
        setProfile({
          nickname: nicknameInput,
          currentStage: 1,
          isRegistered: true,
          isOffChain: true
        });
        setViewingStage(1);
        loadStage(1, "CAMPAIGN", difficulty);
        setFeedback({ type: "success", message: "Registered (Off-chain)" });
        speakText(`Welcome to the grid, ${nicknameInput}. You are in off-chain mode. Connect a Web3 wallet to save progress on the blockchain.`);
        setIsRegistering(false);
      }, 1500);
      return;
    }

    try {
      setIsRegistering(true);
      const eProvider = await activeWallet.getEthereumProvider();
      const provider = new ethers.BrowserProvider(eProvider);

      // Check if user has enough gas before attempting registration
      const balance = await provider.getBalance(activeWallet.address);
      if (balance === 0n) {
        playError();
        setFeedback({ type: "error", message: "No CELO for gas. Fund your wallet to register." });
        speakText("Insufficient gas detected. You need CELO to register on the blockchain.");
        return;
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
      
      const tx = await contract.registerUser(nicknameInput);
      setFeedback({ type: "loading", message: "Minting Beginner Badge..." });
      await tx.wait();
      
      playSuccess();
      setFeedback({ type: "success", message: "Identity registered!" });
      speakText(`Identity confirmed. Welcome, ${nicknameInput}.`);
      await loadProfile();
    } catch (error) {
      if (error?.message?.includes("Already registered") || error?.revert?.args?.includes("Already registered")) {
        speakText(`Identity already exists. Welcome back, ${nicknameInput}.`);
        await loadProfile();
        return;
      }
      playError();
      console.error(error);
      const msg = error?.message?.includes("insufficient funds")
        ? "No CELO for gas. Fund your wallet to register."
        : "Registration failed.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsRegistering(false);
    }
  };

  // Web Speech API
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setFeedback({ type: "info", message: "Listening... speak now." });
    };

    recognitionRef.current.onresult = async (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript.toUpperCase().trim();
      setTranscript(result);
      checkAnswer(result);
    };

    recognitionRef.current.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      setFeedback({ type: "error", message: "Voice recognition failed." });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const checkAnswer = async (guess) => {
    if (!currentStageData || !guess) return;
    if (guess.toUpperCase().trim() === currentStageData.word.toUpperCase().trim()) {
      setIsSubmitting(true);
      playSuccess();
      speakText("Access granted. Impressive hacking.");
      setFeedback({ type: "success", message: "Correct! Advancing stage..." });
      
      // If user is playing off-chain, just update local state after delay
      if (profile?.isOffChain) {
        setTimeout(() => {
          const nextStage = profile.currentStage + 1;
          setProfile(prev => ({ ...prev, currentStage: nextStage }));
          setViewingStage(nextStage);
          loadStage(nextStage, "CAMPAIGN", difficulty);
          setIsSubmitting(false);
          setTranscript("");
        }, 1500);
        return;
      }
      
      const isBlockchainStage = category === "CAMPAIGN" && profile && viewingStage === profile.currentStage;
      
      if (isBlockchainStage) {
        try {
          const activeWallet = getActiveWallet();
          if (!activeWallet) {
            setFeedback({ type: "error", message: "This game is fully on-chain. Connect a Web3 wallet to save progress." });
            setIsSubmitting(false);
            return;
          }
          if (activeWallet.chainId && activeWallet.chainId !== "eip155:42220" && activeWallet.chainId !== "eip155:44787") {
            playError();
            speakText("Wrong network detected. Please switch to Celo.");
            setFeedback({ type: "error", message: "Wrong network! Please switch your wallet to Celo." });
            setIsSubmitting(false);
            return;
          }
          setFeedback({ type: "loading", message: "Correct! Saving progress to blockchain..." });
          const eProvider = await activeWallet.getEthereumProvider();
          const provider = new ethers.BrowserProvider(eProvider);

          const balance = await provider.getBalance(activeWallet.address);
          if (balance === 0n) {
            playError();
            setFeedback({ type: "error", message: "No CELO for gas. Fund your wallet to save progress." });
            setIsSubmitting(false);
            return;
          }

          const signer = await provider.getSigner();
          const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
          
          const tx = await contract.submitStageAnswer(guess);
          await tx.wait();
          
          playUnlock();
          setFeedback({ type: "success", message: "Progress Saved!" });
          setTimeout(() => {
            loadProfile(); // Load next stage
            setIsSubmitting(false);
          }, 1500);
        } catch (err) {
          playError();
          console.error(err);
          const msg = err?.message?.includes("insufficient funds")
            ? "No CELO for gas. Fund your wallet to save progress."
            : "Blockchain submission failed.";
          setFeedback({ type: "error", message: msg });
          setIsSubmitting(false);
        }
      } else {
        playUnlock();
        setTimeout(() => {
          loadStage(viewingStage + 1, category, difficulty);
          setIsSubmitting(false);
        }, 1500);
      }
    } else {
      playError();
      speakText("Incorrect. Security systems alerted.");
      setFeedback({ type: "error", message: `Incorrect guess: ${guess}` });
    }
  };

  // Micro-transactions
  const handleBypass = async () => {
    // If playing off-chain, bypass locally
    if (profile?.isOffChain) {
      playError();
      speakText("Bypass denied. On-chain clearance required. Connect a Web3 wallet.");
      setFeedback({ type: "error", message: "Bypass requires on-chain connection." });
      return;
    }

    try {
      setFeedback({ type: "loading", message: "Approving cUSD..." });
      const activeWallet = getActiveWallet();
      if (!activeWallet) {
        playError();
        setFeedback({ type: "error", message: "This game is fully on-chain. Connect a Web3 wallet to bypass." });
        return;
      }
      if (activeWallet.chainId && activeWallet.chainId !== "eip155:42220" && activeWallet.chainId !== "eip155:44787") {
        playError();
        speakText("Wrong network detected. Please switch to Celo.");
        setFeedback({ type: "error", message: "Wrong network! Please switch your wallet to Celo." });
        return;
      }
      const eProvider = await activeWallet.getEthereumProvider();
      const provider = new ethers.BrowserProvider(eProvider);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
      const fee = await contract.bypassFee();
      
      const cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, signer);
      const approveTx = await cusdContract.approve(GAME_CONTRACT_ADDRESS, fee);
      await approveTx.wait();

      setFeedback({ type: "loading", message: "Processing bypass..." });
      const tx = await contract.bypassStage();
      await tx.wait();

      playSuccess();
      speakText(`Stage bypassed. The answer was ${currentStageData.word}`);
      setFeedback({ type: "success", message: `Bypassed! Answer: ${currentStageData.word}` });
      setTimeout(() => {
        loadProfile();
      }, 4000);
    } catch (err) {
      playError();
      console.error(err);
      setFeedback({ type: "error", message: "Bypass failed." });
    }
  };

  const handleBuyHint = async () => {
    // If playing off-chain, show hint locally
    if (profile?.isOffChain) {
      setShowHint(true);
      speakText("Hint unlocked.");
      setFeedback({ type: "success", message: "Hint unlocked for free! (Off-chain)" });
      return;
    }

    try {
      setFeedback({ type: "loading", message: "Approving cUSD..." });
      const activeWallet = getActiveWallet();
      if (!activeWallet) {
        playError();
        setFeedback({ type: "error", message: "This game is fully on-chain. Connect a Web3 wallet to buy hints." });
        return;
      }
      if (activeWallet.chainId && activeWallet.chainId !== "eip155:42220" && activeWallet.chainId !== "eip155:44787") {
        playError();
        speakText("Wrong network detected. Please switch to Celo.");
        setFeedback({ type: "error", message: "Wrong network! Please switch your wallet to Celo." });
        return;
      }
      const eProvider = await activeWallet.getEthereumProvider();
      const provider = new ethers.BrowserProvider(eProvider);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
      const fee = await contract.hintFee();
      
      const cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, signer);
      const approveTx = await cusdContract.approve(GAME_CONTRACT_ADDRESS, fee);
      await approveTx.wait();

      setFeedback({ type: "loading", message: "Purchasing hint..." });
      const tx = await contract.buyHint();
      await tx.wait();

      playUnlock();
      setShowHint(true);
      speakText("Hint unlocked.");
      setFeedback({ type: "success", message: "Hint purchased!" });
    } catch (err) {
      playError();
      console.error(err);
      setFeedback({ type: "error", message: "Hint purchase failed." });
    }
  };

  if (isLoading) {
    return (
      <div data-testid="text-0d6e05" className="min-h-screen bg-transparent text-[#35D07F] flex items-center justify-center font-mono text-xl animate-pulse">
        [ CONNECTING TO MAINFRAME... ]
      </div>
    );
  }

  // Registration View
  if (profile && !profile.isRegistered) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-6">
        <div aria-label="Interactive element 11ae" className="w-full max-w-md p-8 border-2 border-[#35D07F] bg-transparent/50 backdrop-blur shadow-[0_0_30px_rgba(53,208,127,0.2)]">
          <h2 aria-label="Interactive element cb96" className="text-3xl font-black mb-6 text-[#35D07F]">REGISTER IDENTITY</h2>
          <p data-theme-role="primary-surface" className="text-neutral-400 mb-8 font-mono text-sm">
            You must mint your Beginner Badge NFT to enter the grid. Enter a hacker alias below.
          </p>
          <input 
            type="text" 
            value={nicknameInput}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 15);
              playKeystroke();
              setNicknameInput(val);
            }}
            placeholder="NICKNAME" 
            className="w-full bg-transparent border-b-2 border-[#35D07F]/50 focus:border-[#35D07F] outline-none py-3 text-xl font-mono text-[#35D07F] placeholder:text-[#35D07F]/30 mb-8"
          />
          <button 
            onClick={handleRegister}
            disabled={isRegistering || !nicknameInput}
            className="w-full gaming-btn py-4 border border-[#35D07F] text-[#35D07F] font-bold hover:bg-[#35D07F] hover:text-black disabled:opacity-50"
          >
            {isRegistering ? "[ MINTING... ]" : "[ INITIALIZE ]"}
          </button>
          
          {feedback.message && (
            <p className={`mt-4 font-mono text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-[#35D07F]'}`}>
              &gt; {feedback.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Game Completed View
  if (currentStageData?.isComplete) {
    return <VictoryScreen profile={profile} networkName="Celo" />;
  }

  // Network Error Fallback
  if (!profile) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md p-8 border-2 border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <h2 className="text-xl font-bold text-red-500 mb-4 tracking-widest">[ NETWORK_ERROR ]</h2>
          <p className="font-mono text-sm text-neutral-300 leading-relaxed">
            Failed to establish a secure connection to the Celo Alfajores network or load your operative profile. 
            <br/><br/>
            &gt; Please ensure your wallet is connected to the correct network.<br/>
            &gt; Refresh the connection to try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 w-full gaming-btn py-3 border border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-black transition-colors"
          >
            [ REBOOT_SYSTEM ]
          </button>
        </div>
      </div>
    );
  }

  // Main Game View
  return (
    <div className="min-h-screen bg-transparent text-white pb-24">
      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} networkName="CELO" speakText={speakText} />}
      {/* Top HUD */}
      <div className="w-full border-b border-[#35D07F]/30 bg-black/60 backdrop-blur-md sticky top-0 z-50 p-2 md:p-4 flex justify-between items-center font-mono shadow-[0_4px_20px_rgba(53,208,127,0.1)]">
        <div data-component-id="3ae73c0a" className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="text-white/60 hover:text-[#35D07F] transition-colors flex items-center gap-1 md:gap-2 text-[10px] md:text-sm">
            <Home className="w-4 h-4 md:w-4 md:h-4" /> <span data-theme-role="primary-surface" className="hidden md:inline">HOME</span>
          </Link>
          <div aria-label="Interactive element 3ac3" className="flex items-center gap-2 md:gap-4 border-l border-white/10 pl-2 md:pl-6">
            <span data-theme-role="primary-surface" className="text-[#35D07F] font-bold tracking-widest uppercase text-xs md:text-base">
              {profile?.nickname || "UNKNOWN"}
            </span>
            {isMiniPay && (
              <span data-testid="container-2526f1" className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/50">
                MINIPAY
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/leaderboard" className="text-white/60 hover:text-[#35D07F] transition-colors flex items-center gap-1 md:gap-2 text-[10px] md:text-sm">
             <Trophy className="w-4 h-4" /> <span data-component-id="08194759" className="hidden md:inline">RANKS</span>
          </Link>
          <Link href="/profile" className="text-white/60 hover:text-[#35D07F] transition-colors flex items-center gap-1 md:gap-2 text-[10px] md:text-sm">
             <User className="w-4 h-4" /> <span data-theme-role="primary-surface" className="hidden md:inline">PROFILE</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4 border-l border-white/10 pl-2 md:pl-6">
            <div className="flex flex-col items-end">
              <select 
                value={difficulty}
                onChange={(e) => loadStage(viewingStage, category, e.target.value)}
                className="bg-transparent text-[8px] md:text-[10px] text-neutral-500 mt-1 outline-none cursor-pointer"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MED</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
               <button onClick={handlePrevStage} disabled={viewingStage === 1} className="text-[#35D07F] disabled:opacity-30 hover:scale-110 transition-transform text-sm md:text-lg">&lt;</button>
               <div className="text-[10px] md:text-xs text-neutral-300 font-bold w-12 md:w-16 text-center">STG {viewingStage}</div>
               <button onClick={handleNextStage} disabled={category === "CAMPAIGN" && viewingStage >= profile?.currentStage} className="text-[#35D07F] disabled:opacity-30 hover:scale-110 transition-transform text-sm md:text-lg">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-8 md:mt-12 flex flex-col items-center">
        
        {/* Orbital System */}
        <div className="relative w-[240px] h-[240px] md:w-[500px] md:h-[500px] flex items-center justify-center mb-16 group mt-8 md:mt-0">
          
          {/* Orbital Path Backgrounds */}
          <div className="absolute inset-2 md:inset-8 border border-[#35D07F]/20 rounded-full mix-blend-screen shadow-[0_0_30px_rgba(53,208,127,0.05)]"></div>
          <div className="absolute inset-10 md:inset-24 border border-[#35D07F]/10 rounded-full border-dashed"></div>

          {/* Central Terminal Hub */}
          <div className="z-10 w-[120px] h-[120px] md:w-[260px] md:h-[260px] rounded-full border-2 border-[#35D07F]/60 backdrop-blur-xl bg-black/80 shadow-[0_0_50px_rgba(53,208,127,0.2)] flex flex-col items-center justify-center relative p-2 md:p-4 transition-all duration-500 group-hover:border-[#35D07F] group-hover:shadow-[0_0_60px_rgba(53,208,127,0.4)]">
            
            <button
              onClick={toggleListening}
              className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center mt-3 md:mt-6 transition-all duration-300 ${
                isListening 
                  ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse" 
                  : "bg-[#35D07F]/10 border border-[#35D07F]/50 hover:bg-[#35D07F]/20 hover:border-[#35D07F] hover:shadow-[0_0_20px_rgba(53,208,127,0.4)]"
              }`}
            >
              {isListening ? <Mic className="w-4 h-4 md:w-6 md:h-6 text-red-500" /> : <MicOff className="w-4 h-4 md:w-6 md:h-6 text-[#35D07F]" />}
            </button>

            <div className="w-full flex justify-center mt-2 md:mt-4 mb-1 md:mb-2">
              <div className="flex items-center text-[#35D07F] font-mono text-sm md:text-2xl w-[80px] md:w-[180px] border-b-2 border-[#35D07F]/50 focus-within:border-[#35D07F] pb-1 transition-all">
                <input 
                  type="text" 
                  value={transcript}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().slice(0, 15);
                    playKeystroke();
                    setTranscript(val);
                    if (feedback.message) setFeedback({ type: "", message: "" });
                  }}
                  placeholder="TYPE YOUR ANSWER" 
                  className="w-full bg-transparent outline-none text-[#35D07F] placeholder:text-[#35D07F]/30 placeholder:text-[6px] md:placeholder:text-[10px] placeholder:align-middle text-center"
                />
              </div>
            </div>

            {transcript && !isListening && !feedback.message && (
              <button 
                onClick={() => checkAnswer(transcript)}
                className="mt-1 md:mt-2 px-3 py-1 md:px-6 md:py-2 bg-[#35D07F] text-black font-black text-[8px] md:text-sm tracking-widest uppercase hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all rounded-full flex items-center gap-1 md:gap-2"
              >
                SUBMIT <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            )}

            {feedback.message && (
              <p className={`absolute bottom-2 md:bottom-5 font-mono text-[8px] md:text-[10px] text-center w-[85%] truncate ${
                feedback.type === 'error' ? 'text-red-500' : 
                feedback.type === 'success' ? 'text-[#35D07F]' : 
                'text-yellow-500'
              }`}>
                &gt; {feedback.message}
              </p>
            )}
          </div>

          {/* Orbiting Images */}
          <div className="absolute inset-0 animate-orbit group-hover:animate-orbit-paused flex items-center justify-center">
            {[0, 1, 2, 3].map((index) => {
              const angle = index * 90;
              return (
                <div key={index} className="absolute w-full h-full" style={{ transform: `rotate(${angle}deg)` }}>
                  <div className="absolute top-0 left-1/2 -ml-[55px] md:-ml-[80px] w-[110px] h-[110px] md:w-[160px] md:h-[160px] -mt-[55px] md:-mt-[40px]">
                    <div className="w-full h-full animate-counter-orbit group-hover:animate-counter-orbit-paused">
                      <div className="w-full h-full" style={{ transform: `rotate(-${angle}deg)` }}>
                        
                        <div 
                          onClick={() => revealImage(index)} 
                          className="group/img rounded-full w-full h-full overflow-hidden border-2 border-[#35D07F]/40 hover:border-[#35D07F] hover:shadow-[0_0_30px_rgba(53,208,127,0.6)] hover:scale-110 transition-all duration-300 cursor-pointer bg-black/80 backdrop-blur flex items-center justify-center relative"
                        >
                          {revealedImages[index] ? (
                            <img 
                              src={currentStageData?.imageUrls?.[index] || currentStageData?.imageUrl} 
                              alt={`Anomaly ${index}`}
                              className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 group-hover/img:scale-110 transition-all duration-700" 
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-[#35D07F]/50 group-hover/img:text-[#35D07F]">
                              <Lock className="w-4 h-4 md:w-6 md:h-6 mb-0.5 md:mb-1" />
                              <span className="text-[6px] md:text-[10px] font-mono tracking-widest text-center leading-none">ENCRYPTED</span>
                            </div>
                          )}
                          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40 mix-blend-overlay"></div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Micro-transaction HUD */}
        <div data-theme-role="primary-surface" className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8 w-full max-w-md mx-auto">
          <button 
            onClick={handleBuyHint}
            className="flex items-center justify-center gap-2 px-4 py-3 neo-btn text-yellow-500 font-mono text-xs md:text-sm flex-1 whitespace-nowrap"
          >
            <AlertCircle className="w-4 h-4" /> {profile?.isOffChain ? "FREE HINT" : "0.01 cUSD HINT"}
          </button>
          <button 
            onClick={handleBypass}
            className="flex items-center justify-center gap-2 px-4 py-3 neo-btn text-red-500 font-mono text-xs md:text-sm flex-1 whitespace-nowrap"
          >
            <FastForward className="w-4 h-4" /> {profile?.isOffChain ? "BYPASS" : "0.05 cUSD BYPASS"}
          </button>
        </div>

        {/* Hint Display */}
        {showHint && (
          <div className="w-full max-w-md mx-auto p-4 border-l-4 border-yellow-500 bg-yellow-500/10 text-yellow-200 font-mono animate-in fade-in slide-in-from-top-4 shadow-[0_0_20px_rgba(234,179,8,0.1)] rounded-r">
            &gt; DECRYPTED DATA: {currentStageData?.hint}
          </div>
        )}

      </div>
    </div>
  );
}
