import React from 'react';
import {
  MessageSquare,
  Facebook,
  Youtube,
  Instagram,
  PhoneCall,
  LayoutGrid,
  Camera,
  Grid,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { TaskType } from '../types';

export interface AppTile {
  id: string;
  name: string;
  sublabel: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  shadowColor: string;
  taskType: TaskType;
}

interface AppGridProps {
  onSelectApp: (app: AppTile) => void;
}

export const APPS_DATA: AppTile[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    sublabel: 'AI Assistant',
    taskType: 'whatsapp_reply',
    bgGradient: 'from-emerald-500/20 via-emerald-600/10 to-slate-900',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#128C7E] to-[#25D366] flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.5)]">
        <MessageSquare className="w-5 h-5 text-white fill-white/20" />
      </div>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    sublabel: 'Social Media',
    taskType: 'facebook_post',
    bgGradient: 'from-blue-600/20 via-blue-700/10 to-slate-900',
    borderColor: 'border-blue-500/40 hover:border-blue-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1877F2] to-[#2851A3] flex items-center justify-center shadow-[0_0_15px_rgba(24,119,242,0.5)]">
        <Facebook className="w-5 h-5 text-white fill-white" />
      </div>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    sublabel: 'Video & Content',
    taskType: 'youtube_script',
    bgGradient: 'from-red-600/20 via-red-700/10 to-slate-900',
    borderColor: 'border-red-500/40 hover:border-red-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF0000] to-[#CC0000] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.5)]">
        <Youtube className="w-5 h-5 text-white fill-white" />
      </div>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    sublabel: 'Social Media',
    taskType: 'instagram_caption',
    bgGradient: 'from-fuchsia-600/20 via-rose-600/10 to-slate-900',
    borderColor: 'border-pink-500/40 hover:border-pink-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-[0_0_15px_rgba(220,39,67,0.5)]">
        <Instagram className="w-5 h-5 text-white" />
      </div>
    ),
  },
  {
    id: 'phone',
    name: 'Phone',
    sublabel: 'Call & SMS',
    taskType: 'phone_sms',
    bgGradient: 'from-emerald-600/20 via-teal-600/10 to-slate-900',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        <PhoneCall className="w-5 h-5 text-white fill-white/20" />
      </div>
    ),
  },
  {
    id: 'apps',
    name: 'Apps',
    sublabel: 'Open & Control',
    taskType: 'custom',
    bgGradient: 'from-cyan-600/20 via-blue-600/10 to-slate-900',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#06b6d4] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
        <LayoutGrid className="w-5 h-5 text-white" />
      </div>
    ),
  },
  {
    id: 'camera',
    name: 'Camera',
    sublabel: 'Photos & Media',
    taskType: 'camera_ocr',
    bgGradient: 'from-sky-600/20 via-blue-600/10 to-slate-900',
    borderColor: 'border-sky-500/40 hover:border-sky-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)]">
        <Camera className="w-5 h-5 text-white" />
      </div>
    ),
  },
  {
    id: 'more',
    name: 'More',
    sublabel: 'All Services',
    taskType: 'translate',
    bgGradient: 'from-purple-600/20 via-indigo-600/10 to-slate-900',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    shadowColor: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    icon: (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
        <Grid className="w-5 h-5 text-white" />
      </div>
    ),
  },
];

export const AppGrid: React.FC<AppGridProps> = ({ onSelectApp }) => {
  const handleClick = (app: AppTile) => {
    sound.playChirp();
    onSelectApp(app);
  };

  return (
    <div className="w-full grid grid-cols-4 gap-2.5 my-3 select-none px-1">
      {APPS_DATA.map((app) => (
        <button
          key={app.id}
          onClick={() => handleClick(app)}
          className={`group relative flex flex-col items-center justify-between p-2.5 rounded-2xl bg-gradient-to-b ${app.bgGradient} bg-opacity-70 backdrop-blur-md border ${app.borderColor} transition-all duration-200 active:scale-95 cursor-pointer text-center ${app.shadowColor} min-h-[92px]`}
        >
          {/* App Icon */}
          <div className="group-hover:scale-105 transition-transform">
            {app.icon}
          </div>

          {/* Text Labels */}
          <div className="mt-1.5 w-full">
            <div className="text-xs font-bold text-slate-100 tracking-tight truncate">
              {app.name}
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate leading-tight">
              {app.sublabel}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
