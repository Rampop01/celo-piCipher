"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mic, MicOff, AlertCircle, Play, FastForward, CheckCircle2, Lock, Home, Trophy, User } from "lucide-react";
import { ethers } from "ethers";
import { GAME_VAULT } from "../../../data/vault";
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
  const [currentStageData, setCurrentStageData] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [revealedImages, setRevealedImages] = useState([true, false, false, false]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Refs
  const recognitionRef = useRef(null);

  // 1. Detect MiniPay & Load Profile
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
      setIsMiniPay(true);
    }
    if (authenticated && wallets.length > 0) {
      loadProfile();
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

  // Load user profile from contract
  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const eProvider = await wallets[0].getEthereumProvider();
      const provider = new ethers.BrowserProvider(eProvider);
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, provider);
      const userAddress = wallets[0].address;

      const userProfile = await contract.profiles(userAddress);
      
      if (userProfile.isRegistered) {
        setProfile({
          nickname: userProfile.nickname,
          currentStage: Number(userProfile.currentStage),
          isRegistered: true
        });
        loadStage(Number(userProfile.currentStage));
        speakText(`Welcome back to the grid, ${userProfile.nickname}.`);
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

  const loadStage = (stageId) => {
    const stage = GAME_VAULT.find(s => s.stageId === stageId);
    if (stage) {
      setCurrentStageData(stage);
      setShowHint(false);
      setTranscript("");
      setRevealedImages([true, false, false, false]);
    } else {
      // You beat the game!
      setCurrentStageData({ isComplete: true });
      speakText("Incredible. You have bypassed all security protocols. Campaign completed.");
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
    try {
      setIsRegistering(true);
      const eProvider = await wallets[0].getEthereumProvider();
      const provider = new ethers.BrowserProvider(eProvider);
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
      setFeedback({ type: "error", message: "Registration failed." });
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
      speakText("Access granted. Impressive hacking.");
      setFeedback({ type: "success", message: "Correct! Submitting to blockchain..." });
      
      try {
        const eProvider = await wallets[0].getEthereumProvider();
        const provider = new ethers.BrowserProvider(eProvider);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
        
        // Use hardcoded bypass for hackathon speed since hashing on client matches hashing on contract
        // But the contract expects the actual answer string
        const tx = await contract.submitStageAnswer(guess);
        await tx.wait();
        
        playUnlock();
        loadProfile(); // Load next stage
      } catch (err) {
        playError();
        console.error(err);
        setFeedback({ type: "error", message: "Blockchain submission failed." });
      }
    } else {
      playError();
      speakText("Incorrect. Security systems alerted.");
      setFeedback({ type: "error", message: `Incorrect guess: ${guess}` });
    }
  };

  // Micro-transactions
  const handleBypass = async () => {
    try {
      setFeedback({ type: "loading", message: "Approving cUSD..." });
      const eProvider = await wallets[0].getEthereumProvider();
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
      speakText("Stage bypassed using cUSD.");
      setFeedback({ type: "success", message: "Stage bypassed!" });
      loadProfile();
    } catch (err) {
      playError();
      console.error(err);
      setFeedback({ type: "error", message: "Bypass failed." });
    }
  };

  const handleBuyHint = async () => {
    try {
      setFeedback({ type: "loading", message: "Approving cUSD..." });
      const eProvider = await wallets[0].getEthereumProvider();
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
      <div className="min-h-screen bg-transparent text-[#35D07F] flex items-center justify-center font-mono text-xl animate-pulse">
        [ CONNECTING TO MAINFRAME... ]
      </div>
    );
  }

  // Registration View
  if (profile && !profile.isRegistered) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md p-8 border-2 border-[#35D07F] bg-transparent/50 backdrop-blur shadow-[0_0_30px_rgba(53,208,127,0.2)]">
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

  // Main Game View
  return (
    <div className="min-h-screen bg-transparent text-white pb-24">
      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} networkName="CELO" speakText={speakText} />}
      {/* Top HUD */}
      <div className="w-full border-b border-[#35D07F]/30 bg-black/60 backdrop-blur-md sticky top-0 z-50 p-4 flex justify-between items-center font-mono shadow-[0_4px_20px_rgba(53,208,127,0.1)]">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white/60 hover:text-[#35D07F] transition-colors flex items-center gap-2 text-sm">
            <Home className="w-4 h-4" /> <span data-theme-role="primary-surface" className="hidden md:inline">HOME</span>
          </Link>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <span data-theme-role="primary-surface" className="text-[#35D07F] font-bold tracking-widest uppercase">
              {profile?.nickname || "UNKNOWN"}
            </span>
            {isMiniPay && (
              <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/50">
                MINIPAY
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/leaderboard" className="text-white/60 hover:text-[#35D07F] transition-colors flex items-center gap-2 text-sm">
             <Trophy className="w-4 h-4" /> <span data-component-id="08194759" className="hidden md:inline">RANKS</span>
          </Link>
          <Link href="/profile" className="text-white/60 hover:text-[#35D07F] transition-colors flex items-center gap-2 text-sm">
             <User className="w-4 h-4" /> <span className="hidden md:inline">PROFILE</span>
          </Link>
          <div data-testid="text-d14b12" className="text-right border-l border-white/10 pl-6">
            <div className="text-xs text-neutral-500">STAGE {profile?.currentStage}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
        
        {/* Main Image View (2x2 Grid) */}
        <div className="w-full aspect-square md:aspect-video grid grid-cols-2 gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => {
             const filters = ["", "hue-rotate-90 saturate-200", "invert sepia", "grayscale contrast-200"];
              return (
               <TiltCard key={index} className="w-full h-full">
                 <div 
                      className="border border-[#35D07F]/30 relative group overflow-hidden backdrop-blur-md bg-black/40 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(53,208,127,0.1)] hover:shadow-[0_0_30px_rgba(53,208,127,0.3)] hover:border-[#35D07F] transition-all duration-300 w-full h-full"
                      onClick={() => revealImage(index)}>
                    {revealedImages[index] ? (
                      <img 
                        src={currentStageData?.imageUrl} 
                        alt={`Cipher Anomaly ${index+1}`} 
                        className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ${filters[index]}`}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#35D07F]/40 group-hover:text-[#35D07F] transition-colors">
                        <Lock className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-mono text-xs tracking-widest text-center transition-transform group-hover:animate-glitch-skew">DATA<br/>ENCRYPTED</span>
                      </div>
                    )}
                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40 mix-blend-overlay"></div>
                 </div>
               </TiltCard>
             )
          })}
        </div>

        {/* Micro-transaction HUD */}
        <div data-theme-role="primary-surface" className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={handleBuyHint}
            className="flex items-center justify-center gap-2 px-3 py-4 neo-btn text-yellow-500 font-mono text-xs md:text-sm"
          >
            <AlertCircle className="w-4 h-4" /> 0.01 cUSD HINT
          </button>
          <button 
            onClick={handleBypass}
            className="flex items-center justify-center gap-2 px-3 py-4 neo-btn text-red-500 font-mono text-xs md:text-sm"
          >
            <FastForward className="w-4 h-4" /> 0.05 cUSD BYPASS
          </button>
        </div>

        {/* Hint Display */}
        {showHint && (
          <div className="w-full p-4 border-l-4 border-yellow-500 bg-yellow-500/10 text-yellow-200 font-mono mb-8 animate-in fade-in slide-in-from-top-4">
            &gt; DECRYPTED DATA: {currentStageData?.hint}
          </div>
        )}

        {/* Input Area */}
        <div className="w-full p-6 border border-[#35D07F]/40 backdrop-blur-lg bg-black/60 relative shadow-[0_0_30px_rgba(53,208,127,0.1)]">
          <div className="absolute -top-3 left-4 bg-black px-2 text-xs text-[#35D07F] font-mono border border-[#35D07F]/50">
            TERMINAL_INPUT.exe
          </div>
          
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ${
                isListening 
                  ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse" 
                  : "bg-[#35D07F]/10 border border-[#35D07F]/50 hover:border-[#35D07F] hover:shadow-[0_0_20px_rgba(53,208,127,0.4)]"
              }`}
            >
              {isListening ? <Mic className="w-8 h-8 text-red-500" /> : <MicOff className="w-8 h-8 text-[#35D07F]" />}
            </button>

            <div data-cy="cy-6f7368" className="w-full flex justify-center mb-6">
                 <div className="flex items-center text-[#35D07F] font-mono text-2xl w-full max-w-sm border-b border-[#35D07F]/50 focus-within:border-[#35D07F] focus-within:shadow-[0_4px_15px_-3px_rgba(53,208,127,0.3)] pb-2 transition-all">
                   <input 
                      type="text" 
                      value={transcript}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().slice(0, 50);
                        playKeystroke();
                        setTranscript(val);
                      }}
                      placeholder="_" 
                      className="w-full bg-transparent outline-none text-[#35D07F] placeholder:text-[#35D07F]/30"
                    />
                 </div>
            </div>

            {transcript && !isListening && (
              <button 
                onClick={() => checkAnswer(transcript)}
                className="px-8 py-3 bg-[#35D07F] text-black font-black tracking-widest uppercase hover:bg-white transition-colors flex items-center gap-2"
              >
                SUBMIT <CheckCircle2 className="w-5 h-5" />
              </button>
            )}

            {feedback.message && (
              <p className={`mt-6 font-mono text-sm text-center ${
                feedback.type === 'error' ? 'text-red-500' : 
                feedback.type === 'success' ? 'text-[#35D07F]' : 
                'text-yellow-500'
              }`}>
                &gt; {feedback.message}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
