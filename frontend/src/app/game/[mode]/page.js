"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Mic, Terminal, ArrowLeft, Loader2, Play } from "lucide-react";

export default function GameScreen() {
  const params = useParams();
  const mode = params?.mode;
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualInput, setManualInput] = useState("");
  
  // Game state (1, 2, 3, or 4 based on mode parameter)
  const numPics = parseInt(mode) || 4;

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
      return;
    }
    
    // Simulate fetching random AI images from backend
    setTimeout(() => {
      setImages([
        "https://picsum.photos/seed/cyber1/400/400",
        "https://picsum.photos/seed/cyber2/400/400",
        "https://picsum.photos/seed/cyber3/400/400",
        "https://picsum.photos/seed/cyber4/400/400"
      ].slice(0, numPics));
      setLoading(false);
    }, 1500);
  }, [authenticated, mode, router]);

  const toggleRecording = () => {
    // We will integrate Web Speech API here later
    setRecording(!recording);
    if (!recording) {
      setTranscript("Listening...");
      setTimeout(() => {
        setTranscript("HACKER");
        setRecording(false);
      }, 3000);
    } else {
      setTranscript("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAnswer = transcript && transcript !== "Listening..." ? transcript : manualInput;
    if (!finalAnswer) return;
    
    alert("Submitting answer: " + finalAnswer);
    // Submit to smart contract here later
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-sans p-6 md:p-12">
      <header className="flex items-center justify-between mb-12">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#35D07F] hover:text-white transition-colors uppercase tracking-widest font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Abort Mission
        </button>
        <div className="text-[#35D07F] font-mono text-sm tracking-widest border border-[#35D07F]/30 px-4 py-2 bg-[#35D07F]/5">
          MODE: {numPics} PICS // TARGET: CLASSIFIED
        </div>
      </header>

      <main className="max-w-5xl mx-auto flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-6 text-[#35D07F]">
            <Loader2 className="w-12 h-12 animate-spin" />
            <span className="font-mono tracking-widest animate-pulse">DECRYPTING VISUALS...</span>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-3xl mb-16 ${numPics === 1 ? 'place-items-center' : ''}`}>
              {images.map((src, i) => (
                <div key={i} className="relative group overflow-hidden difficulty-card bg-neutral-900 border-2 border-[#35D07F]/20 p-2 shadow-[0_0_15px_rgba(53,208,127,0.1)]">
                  <div className="absolute inset-0 bg-[#35D07F]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                  <img src={src} alt={`Visual clue ${i+1}`} className="w-full h-auto aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute bottom-4 left-4 z-20 bg-black/80 px-2 py-1 border border-[#35D07F] text-[#35D07F] font-mono text-xs">
                    IMG_0{i+1}.SYS
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-2xl bg-black border-2 border-[#35D07F] p-1 difficulty-card shadow-[0_0_30px_rgba(53,208,127,0.15)] relative">
              <div className="absolute -top-3 left-6 bg-black px-2 text-[#35D07F] font-mono text-xs tracking-widest">
                INPUT_TERMINAL
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                
                {/* Voice Input Button */}
                <button 
                  onClick={toggleRecording}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${recording ? 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-[#35D07F] bg-transparent hover:bg-[#35D07F]/10 shadow-[0_0_20px_rgba(53,208,127,0.2)]'}`}
                >
                  <Mic className={`w-10 h-10 ${recording ? 'text-red-500 animate-pulse' : 'text-[#35D07F]'}`} />
                  {recording && (
                    <span className="absolute -bottom-8 text-red-500 font-mono text-xs tracking-widest animate-pulse whitespace-nowrap">
                      RECORDING...
                    </span>
                  )}
                </button>

                <div className="w-px h-16 bg-[#35D07F]/30 hidden md:block" />

                {/* Terminal Typing Override */}
                <form onSubmit={handleSubmit} className="flex-1 w-full relative group">
                  <div className="flex items-center gap-3 text-[#35D07F] font-mono text-xl md:text-2xl border-b-2 border-[#35D07F]/30 pb-2 group-focus-within:border-[#35D07F] transition-colors">
                    <Terminal className="w-6 h-6" />
                    <span className="animate-pulse">&gt;</span>
                    <input 
                      type="text"
                      value={recording ? transcript : manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      disabled={recording}
                      placeholder={recording ? "Speak now..." : "_TYPE_ANSWER_HERE"}
                      className="bg-transparent border-none outline-none flex-1 text-white placeholder-neutral-700 tracking-widest w-full"
                      autoFocus
                    />
                  </div>
                  {!recording && manualInput.length > 0 && (
                    <button type="submit" className="absolute right-0 bottom-3 text-[#35D07F] hover:text-white transition-colors">
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  )}
                </form>

              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
