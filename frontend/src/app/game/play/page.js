"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, AlertCircle, Play, FastForward, CheckCircle2, Lock } from "lucide-react";
import { ethers } from "ethers";
import { GAME_VAULT } from "../../../data/vault";

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
  const [revealedImages, setRevealedImages] = useState([false, false, false, false]);

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
  }, [authenticated, wallets]);

  // Load user profile from contract
  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const provider = await wallets[0].getEthersProvider();
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, provider);
      const userAddress = wallets[0].address;

      const userProfile = await contract.profiles(userAddress);
      
      if (userProfile.isRegistered) {
        setProfile({
          nickname: userProfile.nickname,
          currentStage: Number(userProfile.currentStage)
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
      setRevealedImages([false, false, false, false]);
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
      const provider = await wallets[0].getEthersProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
      
      const tx = await contract.registerUser(nicknameInput);
      setFeedback({ type: "loading", message: "Minting Beginner Badge..." });
      await tx.wait();
      
      setFeedback({ type: "success", message: "Identity registered!" });
      speakText(`Identity confirmed. Welcome, ${nicknameInput}.`);
      await loadProfile();
    } catch (error) {
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
    if (!currentStageData) return;
    if (guess === currentStageData.word) {
      speakText("Access granted. Impressive hacking.");
      setFeedback({ type: "success", message: "Correct! Submitting to blockchain..." });
      
      try {
        const provider = await wallets[0].getEthersProvider();
        const signer = provider.getSigner();
        const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
        
        // Use hardcoded bypass for hackathon speed since hashing on client matches hashing on contract
        // But the contract expects the actual answer string
        const tx = await contract.submitStageAnswer(guess);
        await tx.wait();
        
        loadProfile(); // Load next stage
      } catch (err) {
        console.error(err);
        setFeedback({ type: "error", message: "Blockchain submission failed." });
      }
    } else {
      speakText("Incorrect. Security systems alerted.");
      setFeedback({ type: "error", message: `Incorrect guess: ${guess}` });
    }
  };

  // Micro-transactions
  const handleBypass = async () => {
    try {
      setFeedback({ type: "loading", message: "Approving cUSD..." });
      const provider = await wallets[0].getEthersProvider();
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
      const fee = await contract.bypassFee();
      
      const cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, signer);
      const approveTx = await cusdContract.approve(GAME_CONTRACT_ADDRESS, fee);
      await approveTx.wait();

      setFeedback({ type: "loading", message: "Processing bypass..." });
      const tx = await contract.bypassStage();
      await tx.wait();

      speakText("Stage bypassed using cUSD.");
      setFeedback({ type: "success", message: "Stage bypassed!" });
      loadProfile();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Bypass failed." });
    }
  };

  const handleBuyHint = async () => {
    try {
      setFeedback({ type: "loading", message: "Approving cUSD..." });
      const provider = await wallets[0].getEthersProvider();
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_ABI, signer);
      const fee = await contract.hintFee();
      
      const cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, signer);
      const approveTx = await cusdContract.approve(GAME_CONTRACT_ADDRESS, fee);
      await approveTx.wait();

      setFeedback({ type: "loading", message: "Purchasing hint..." });
      const tx = await contract.buyHint();
      await tx.wait();

      setShowHint(true);
      speakText("Hint unlocked.");
      setFeedback({ type: "success", message: "Hint purchased!" });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Hint purchase failed." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-[#35D07F] flex items-center justify-center font-mono text-xl animate-pulse">
        [ CONNECTING TO MAINFRAME... ]
      </div>
    );
  }

  // Registration View
  if (profile && !profile.isRegistered) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md p-8 border-2 border-[#35D07F] bg-black/50 backdrop-blur shadow-[0_0_30px_rgba(53,208,127,0.2)]">
          <h2 className="text-3xl font-black mb-6 text-[#35D07F]">REGISTER IDENTITY</h2>
          <p className="text-neutral-400 mb-8 font-mono text-sm">
            You must mint your Beginner Badge NFT to enter the grid. Enter a hacker alias below.
          </p>
          <input 
            type="text" 
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
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
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <Trophy className="w-24 h-24 text-yellow-500 mb-8 animate-bounce" />
        <h1 className="text-5xl font-black text-yellow-500 mb-4">CAMPAIGN COMPLETE</h1>
        <p className="text-xl text-neutral-400 font-mono text-center">
          You have successfully hacked all 50 stages. <br/> Your NFT Badges prove your dominance.
        </p>
      </div>
    );
  }

  // Main Game View
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Top HUD */}
      <div className="w-full border-b border-[#35D07F]/30 bg-black/80 backdrop-blur sticky top-0 z-50 p-4 flex justify-between items-center font-mono">
        <div className="flex items-center gap-4">
          <span className="text-[#35D07F] font-bold tracking-widest uppercase">
            {profile?.nickname || "UNKNOWN"}
          </span>
          {isMiniPay && (
            <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/50">
              MINIPAY ACTIVE
            </span>
          )}
        </div>
        <div className="text-xl font-black text-white drop-shadow-[0_0_5px_#35D07F]">
          STAGE {profile?.currentStage}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
        
        {/* Main Image View (2x2 Grid) */}
        <div className="w-full aspect-square md:aspect-video grid grid-cols-2 gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => {
             const filters = ["", "hue-rotate-90 saturate-200", "invert sepia", "grayscale contrast-200"];
             return (
               <div key={index} 
                    className="border-2 border-[#35D07F]/50 relative group overflow-hidden bg-black/50 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(53,208,127,0.1)] hover:border-[#35D07F] transition-colors"
                    onClick={() => revealImage(index)}>
                  {revealedImages[index] ? (
                    <img 
                      src={currentStageData?.imageUrl} 
                      alt={`Cipher Anomaly ${index+1}`} 
                      className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ${filters[index]}`}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#35D07F]/50 group-hover:text-[#35D07F] transition-colors">
                      <Lock className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs tracking-widest text-center">REVEAL<br/>ANOMALY_0{index+1}</span>
                    </div>
                  )}
                  {/* Scanline Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-30 mix-blend-overlay"></div>
               </div>
             )
          })}
        </div>

        {/* Micro-transaction HUD */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={handleBuyHint}
            className="flex items-center justify-center gap-2 p-3 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 font-mono text-xs md:text-sm transition-all"
          >
            <AlertCircle className="w-4 h-4" /> 0.01 cUSD HINT
          </button>
          <button 
            onClick={handleBypass}
            className="flex items-center justify-center gap-2 p-3 border border-red-500/50 text-red-500 hover:bg-red-500/10 font-mono text-xs md:text-sm transition-all"
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
        <div className="w-full p-6 border border-[#35D07F]/30 bg-black/50 relative">
          <div className="absolute -top-3 left-4 bg-black px-2 text-xs text-[#35D07F] font-mono">
            VOICE_OVERRIDE.exe
          </div>
          
          <div className="flex flex-col items-center">
            <button
              onClick={toggleListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                isListening 
                  ? "bg-red-500/20 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse" 
                  : "bg-[#35D07F]/10 border-2 border-[#35D07F]/50 hover:border-[#35D07F] hover:shadow-[0_0_20px_rgba(53,208,127,0.3)]"
              }`}
            >
              {isListening ? <Mic className="w-10 h-10 text-red-500" /> : <MicOff className="w-10 h-10 text-[#35D07F]" />}
            </button>

            <div className="w-full flex justify-center gap-2 mb-4">
               <input 
                  type="text" 
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value.toUpperCase())}
                  placeholder="... AWAITING VOCAL INPUT ..." 
                  className="w-full max-w-sm bg-transparent border-b-2 border-neutral-700 focus:border-[#35D07F] outline-none py-2 text-center text-xl font-mono text-white placeholder:text-neutral-700"
                />
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
