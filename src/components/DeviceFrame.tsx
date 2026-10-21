import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface DeviceFrameProps {
  children: React.ReactNode;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  soundEnabled,
  onToggleSound,
}) => {
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('10:24');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Format as 10:24 style or current time
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#02050e] text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 select-none">
      {/* Top Desktop Controls Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 px-3 mb-2 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400">
            RIYAZ AI WORKSPACE
          </span>
          <span className="hidden sm:inline-block text-[11px] text-slate-400">
            • Android 14 (Kotlin + Gemini SDK)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden md:inline text-[10px]">
              {soundEnabled ? 'Sound On' : 'Muted'}
            </span>
          </button>

          {/* Frame Mode Toggle */}
          <button
            onClick={() => {
              sound.playChirp();
              setIsFrameMode(!isFrameMode);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      {isFrameMode ? (
        /* Phone Mockup Frame matching the user's attachment */
        <div className="relative w-full max-w-[420px] h-[890px] rounded-[52px] p-3 bg-gradient-to-b from-[#2a3854] via-[#0d162d] to-[#151f38] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(6,182,212,0.25)] border-[3px] border-[#3e527a]/60 flex flex-col overflow-hidden my-auto">
          {/* Inner Phone Screen Bezel */}
          <div className="relative w-full h-full rounded-[44px] bg-[#040816] overflow-hidden flex flex-col border border-cyan-500/10">
            {/* Status Bar */}
            <div className="h-8 px-6 pt-1.5 flex items-center justify-between text-[11px] text-slate-300 font-semibold z-30 shrink-0 select-none">
              <span className="tracking-tight">{currentTime}</span>

              {/* Speaker slit / punch hole camera */}
              <div className="w-20 h-4 rounded-full bg-black/60 border border-slate-800 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-cyan-500/20" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5">
                {/* Cellular Signal */}
                <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 20h2v-4H2v4zm4 0h2v-8H6v8zm4 0h2V8h-2v12zm4 0h2V4h-2v16zm4 0h2v-18h-2v18z" />
                </svg>
                {/* WiFi */}
                <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0 0 12 4zm0 4.5c3.08 0 5.89 1.15 8.04 3.06L12 19.68 3.96 11.56A12.35 12.35 0 0 1 12 8.5z" />
                </svg>
                {/* Battery */}
                <span className="text-[10px] font-mono text-slate-300">82%</span>
                <div className="w-5 h-2.5 rounded-sm border border-slate-300 p-0.5 flex items-center">
                  <div className="h-full w-[82%] bg-emerald-400 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative z-20">
              {children}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="h-5 flex items-center justify-center shrink-0 z-30 select-none">
              <div className="w-32 h-1 rounded-full bg-slate-400/60" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop Layout */
        <div className="w-full max-w-4xl h-[860px] rounded-3xl bg-[#040816] border border-cyan-500/25 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};
