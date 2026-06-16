export default function GlitchText({ text, className = "" }) {
  return (
    <div className={`relative inline-block group ${className}`}>
      {/* Base Text with clean glitch effect */}
      <span className="relative z-10 text-[#35D07F] font-black tracking-widest block transition-all group-hover:animate-glitch-skew group-hover:drop-shadow-[0_0_20px_rgba(53,208,127,0.8)]">
        {text}
      </span>
    </div>
  );
}
