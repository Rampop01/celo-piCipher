export default function GlitchText({ text, className = "" }) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Base Text */}
      <span className="relative z-10 text-[#35D07F] font-black tracking-widest block animate-glitch-skew">
        {text}
      </span>
      {/* Glitch Layer 1 */}
      <span 
        className="absolute top-0 left-[2px] -z-10 text-red-500 font-black tracking-widest opacity-80 animate-glitch-1"
        aria-hidden="true"
      >
        {text}
      </span>
      {/* Glitch Layer 2 */}
      <span 
        className="absolute top-0 -left-[2px] -z-10 text-blue-500 font-black tracking-widest opacity-80 animate-glitch-2"
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
}
