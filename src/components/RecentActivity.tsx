import React from 'react';
import { Clock, ChevronRight, MessageSquare, Facebook, PhoneCall, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { ActivityItem } from '../types';

interface RecentActivityProps {
  activities: ActivityItem[];
  onSelectActivity: (activity: ActivityItem) => void;
  onViewAll: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onSelectActivity,
  onViewAll,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'whatsapp':
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#128C7E] to-[#25D366] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(37,211,102,0.4)]">
            <MessageSquare className="w-4 h-4 text-white fill-white/20" />
          </div>
        );
      case 'facebook':
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1877F2] to-[#2851A3] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(24,119,242,0.4)]">
            <Facebook className="w-4 h-4 text-white fill-white" />
          </div>
        );
      case 'phone':
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            <PhoneCall className="w-4 h-4 text-white fill-white/20" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        );
    }
  };

  return (
    <div className="w-full my-3 px-1 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/40">
            <Clock className="w-3 h-3 text-cyan-400" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-200">
            Recent Activity
          </span>
        </div>
        <button
          onClick={() => {
            sound.playChirp();
            onViewAll();
          }}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Activity Card Container */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-cyan-500/15 overflow-hidden divide-y divide-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        {activities.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => {
              sound.playChirp();
              onSelectActivity(item);
            }}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getIcon(item.iconName)}
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                  {item.actionTitle}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {item.appName} • {item.timestamp}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        ))}

        {activities.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No recent activity yet. Tap an app above to generate text!
          </div>
        )}
      </div>
    </div>
  );
};
