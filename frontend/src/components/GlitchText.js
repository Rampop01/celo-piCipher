export default function GlitchText({ text, className = "" }) {
  return (
    <div className={`relative inline-block group ${className}`}>
      {/* Base Text */}
      <span className="relative z-10 text-[#35D07F] font-black tracking-widest block transition-transform group-hover:animate-glitch-skew">
        {text}
      </span>
      {/* Glitch Layer 1 */}
      <span 
        className="absolute top-0 left-[2px] -z-10 text-red-500 font-black tracking-widest opacity-0 group-hover:opacity-80 group-hover:animate-glitch-1 transition-opacity"
        aria-hidden="true"
      >
        {text}
      </span>
      {/* Glitch Layer 2 */}
      <span 
        className="absolute top-0 -left-[2px] -z-10 text-blue-500 font-black tracking-widest opacity-0 group-hover:opacity-80 group-hover:animate-glitch-2 transition-opacity"
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
}
