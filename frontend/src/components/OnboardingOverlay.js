import { useState, useEffect } from "react";
import { Mic, Eye, HelpCircle, Check, TerminalSquare } from "lucide-react";
import { useSoundEffects } from "../hooks/useSoundEffects";

export default function OnboardingOverlay({ onComplete, networkName, speakText }) {
  const [step, setStep] = useState(0);
  const { playBlip, playSuccess } = useSoundEffects();

  const steps = [
    {
      title: "WELCOME TO THE GRID",
      icon: <TerminalSquare className="w-16 h-16 text-[#35D07F] mb-4" />,
      content: `You have successfully infiltrated the ${networkName} mainframe. Your mission: decrypt hidden data by solving visual anomalies.`
    },
    {
      title: "REVEAL ANOMALIES",
      icon: <Eye className="w-16 h-16 text-[#35D07F] mb-4" />,
      content: "Click on the locked grid panels to reveal parts of the hidden image. Beware: revealing more decreases your final reward multiplier."
    },
    {
      title: "VOICE OVERRIDE",
      icon: <Mic className="w-16 h-16 text-[#35D07F] mb-4" />,
      content: "Use your microphone or terminal input to submit the decrypted keyword. Only precise matches will bypass the firewall."
    },
    {
      title: "STRATEGIC ASSISTANCE",
      icon: <HelpCircle className="w-16 h-16 text-[#35D07F] mb-4" />,
      content: "Stuck? Purchase encrypted hints or execute a bypass script using network tokens. This will guarantee your progression."
    }
  ];

  useEffect(() => {
    if (speakText && steps[step]) {
      speakText(steps[step].content);
    }
  }, [step]);

  const handleNext = () => {
    playBlip();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      playSuccess();
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-xl w-full border border-[#35D07F]/50 bg-black p-8 relative shadow-[0_0_30px_rgba(53,208,127,0.15)]">
        
        {/* Progress Bar */}
        <div data-tracking="track-bb7f05" className="absolute top-0 left-0 h-1 bg-[#35D07F] transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>

        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500" key={step}>
          {steps[step].icon}
          <h2 data-component-id="4cf4820b" className="text-2xl font-black font-mono text-[#35D07F] tracking-widest mb-4">
            {steps[step].title}
          </h2>
          <p className="text-neutral-300 font-mono leading-relaxed mb-8 h-20">
            {steps[step].content}
          </p>

          <div className="w-full flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-[#35D07F]' : 'bg-neutral-800'}`} />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="flex items-center gap-2 gaming-btn px-6 py-2 bg-[#35D07F]/10 text-[#35D07F] border border-[#35D07F] hover:bg-[#35D07F] hover:text-black font-bold font-mono transition-colors"
            >
              {step === steps.length - 1 ? (
                <>INITIATE <Check className="w-4 h-4" /></>
              ) : (
                "NEXT >"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
