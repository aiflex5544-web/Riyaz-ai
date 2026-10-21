import React from 'react';
import { Mic, Brain, ShieldCheck, BatteryCharging, Wifi, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

interface TelemetryWidgetProps {
  onSelectWidget: (widgetId: string) => void;
  voiceActive?: boolean;
  batteryLevel?: number;
}

export const TelemetryWidget: React.FC<TelemetryWidgetProps> = ({
  onSelectWidget,
  voiceActive = true,
  batteryLevel = 82,
}) => {
  const handleItemClick = (id: string) => {
    sound.playChirp();
    onSelectWidget(id);
  };

  return (
    <div className="w-full flex items-center justify-between px-2 py-1 select-none">
      {/* Left Column Widgets */}
      <div className="flex flex-col gap-2.5 w-[38%]">
        {/* Voice Widget */}
        <button
          onClick={() => handleItemClick('voice')}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-slate-800/60 transition-all text-left group shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Mic className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-300">Voice</div>
            <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {voiceActive ? 'Active' : 'Muted'}
            </div>
          </div>
        </button>

        {/* AI Brain Widget */}
        <button
          onClick={() => handleItemClick('brain')}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/50 hover:bg-slate-800/60 transition-all text-left group shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Brain className="w-4 h-4 text-purple-300" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-300">AI Brain</div>
            <div className="text-xs font-semibold text-purple-300 truncate">Gemini + Others</div>
          </div>
        </button>

        {/* Permissions Widget */}
        <button
          onClick={() => handleItemClick('permissions')}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-blue-500/20 hover:border-blue-400/50 hover:bg-slate-800/60 transition-all text-left group shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-300">Permissions</div>
            <div className="text-xs font-semibold text-blue-400">All Set</div>
          </div>
        </button>
      </div>

      {/* Spacer for Center Mascot */}
      <div className="w-[20%]" />

      {/* Right Column Widgets */}
      <div className="flex flex-col gap-2.5 w-[38%]">
        {/* Battery Widget */}
        <button
          onClick={() => handleItemClick('battery')}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-slate-800/60 transition-all text-left group shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <BatteryCharging className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-300">Battery</div>
            <div className="text-xs font-semibold text-emerald-400">{batteryLevel}%</div>
          </div>
        </button>

        {/* Network Widget */}
        <button
          onClick={() => handleItemClick('network')}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-teal-500/20 hover:border-teal-400/50 hover:bg-slate-800/60 transition-all text-left group shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-950/70 border border-teal-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(20,184,166,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Wifi className="w-4 h-4 text-teal-300" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-300">Network</div>
            <div className="text-xs font-semibold text-teal-400">Good</div>
          </div>
        </button>

        {/* Background Widget */}
        <button
          onClick={() => handleItemClick('background')}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-sky-500/20 hover:border-sky-400/50 hover:bg-slate-800/60 transition-all text-left group shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-950/70 border border-sky-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(14,165,233,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Lock className="w-4 h-4 text-sky-300" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-300">Background</div>
            <div className="text-xs font-semibold text-sky-400">Active</div>
          </div>
        </button>
      </div>
    </div>
  );
};
