import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Mic } from 'lucide-react';
import { sound } from '../utils/audio';

interface HologramMascotProps {
  onTapToSpeak: () => void;
  isProcessing?: boolean;
}

export const HologramMascot: React.FC<HologramMascotProps> = ({
  onTapToSpeak,
  isProcessing = false,
}) => {
  const [blink, setBlink] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Periodic eye blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    sound.playActivate();
    onTapToSpeak();
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-3 select-none">
      {/* "Tap to speak" button pill above mascot */}
      <button
        onClick={handleClick}
        className="group relative z-20 mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all active:scale-95 cursor-pointer"
      >
        {/* Animated equalizer soundwave bars */}
        <div className="flex items-center gap-0.5 h-3">
          <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-[waveBar_0.8s_ease-in-out_infinite]" />
          <span className="w-0.5 h-3 bg-cyan-300 rounded-full animate-[waveBar_1.1s_ease-in-out_0.2s_infinite]" />
          <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-[waveBar_0.9s_ease-in-out_0.4s_infinite]" />
          <span className="w-0.5 h-3.5 bg-cyan-300 rounded-full animate-[waveBar_1.2s_ease-in-out_0.1s_infinite]" />
          <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-[waveBar_0.7s_ease-in-out_0.3s_infinite]" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-cyan-200 group-hover:text-cyan-100">
          {isProcessing ? 'Thinking...' : 'Tap to speak'}
        </span>
      </button>

      {/* Holographic Ring Stage and Robotic Mascot Core */}
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-52 h-52 flex items-center justify-center cursor-pointer group"
      >
        {/* Ambient background bloom glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00F0FF]/25 via-[#8A00FF]/25 to-[#FF007F]/20 blur-2xl animate-pulse-glow pointer-events-none" />

        {/* Outer rotating neon ring (NeonCyan #00F0FF) */}
        <div className="absolute inset-2 rounded-full border border-[#00F0FF]/40 shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-spin-slow" />
        
        {/* Middle neon ring (NeonMagenta #FF007F & NeonPurple #8A00FF) */}
        <div className="absolute inset-5 rounded-full border-2 border-dashed border-[#FF007F]/50 shadow-[0_0_25px_rgba(255,0,127,0.4)] animate-spin-reverse" />

        {/* Inner bright glowing NeonCyan ring */}
        <div
          className={`absolute inset-8 rounded-full border-2 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-transform duration-500 ${
            isHovered || isProcessing ? 'scale-105 border-[#00F0FF]' : 'scale-100'
          }`}
        />

        {/* Pedestal platform base rings at bottom */}
        <div className="absolute -bottom-2 w-40 h-8 rounded-[100%] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent blur-sm" />
        <div className="absolute -bottom-1 w-32 h-4 rounded-[100%] border border-[#00F0FF]/70 shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
        <div className="absolute bottom-0 w-24 h-2.5 rounded-[100%] border border-[#8A00FF]/80 shadow-[0_0_12px_rgba(138,0,255,0.6)]" />

        {/* Floating Mascot Bot Body */}
        <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-b from-[#111524] via-[#070913] to-[#04060c] p-1.5 shadow-[inset_0_0_20px_rgba(0,240,255,0.5),0_0_25px_rgba(138,0,255,0.6)] flex items-center justify-center border border-[#00F0FF]/40 animate-float-orb">
          {/* Cyber glass visor reflection */}
          <div className="absolute top-1.5 left-4 right-4 h-6 rounded-t-full bg-gradient-to-b from-cyan-400/25 to-transparent pointer-events-none" />

          {/* Robot Eyes and Smile Display */}
          <div className="flex flex-col items-center justify-center w-full h-full pt-1">
            {/* Cute Cyan Glowing Eyes */}
            <div className="flex items-center gap-4">
              {/* Left Eye */}
              <div
                className={`transition-all duration-150 flex items-center justify-center ${
                  blink ? 'h-0.5 w-4 bg-cyan-300' : 'h-3.5 w-4'
                }`}
              >
                {!blink && (
                  <svg className="w-5 h-5 text-cyan-300 filter drop-shadow-[0_0_8px_#22d3ee]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c-3.5 0-6.5 2-8 5 1.5 3 4.5 5 8 5s6.5-2 8-5c-1.5-3-4.5-5-8-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                  </svg>
                )}
              </div>

              {/* Right Eye */}
              <div
                className={`transition-all duration-150 flex items-center justify-center ${
                  blink ? 'h-0.5 w-4 bg-cyan-300' : 'h-3.5 w-4'
                }`}
              >
                {!blink && (
                  <svg className="w-5 h-5 text-cyan-300 filter drop-shadow-[0_0_8px_#22d3ee]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c-3.5 0-6.5 2-8 5 1.5 3 4.5 5 8 5s6.5-2 8-5c-1.5-3-4.5-5-8-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Glowing Smile */}
            <div className="mt-2.5">
              <svg className="w-8 h-2.5 text-cyan-300 filter drop-shadow-[0_0_6px_#22d3ee]" viewBox="0 0 32 10" fill="none">
                <path
                  d="M2 2C8 8 24 8 30 2"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Interactive touch indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
