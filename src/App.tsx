import React, { useState } from 'react';
import {
  Menu,
  Settings,
  Crown,
  Home,
  MessageSquare,
  Calendar,
  User,
  Mic,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  RotateCcw,
} from 'lucide-react';
import { sound } from './utils/audio';
import { TabType, ActivityItem, ChatMessage, BackgroundTask } from './types';
import { DeviceFrame } from './components/DeviceFrame';
import { HologramMascot } from './components/HologramMascot';
import { TelemetryWidget } from './components/TelemetryWidget';
import { AppGrid, AppTile, APPS_DATA } from './components/AppGrid';
import { RecentActivity } from './components/RecentActivity';
import { TextProcessingModal } from './components/TextProcessingModal';
import { VoiceModal } from './components/VoiceModal';
import { ChatView } from './components/ChatView';
import { TasksView, INITIAL_TASKS } from './components/TasksView';
import { ProfileView } from './components/ProfileView';
import { SettingsModal } from './components/SettingsModal';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { VoiceProfileId, getStoredVoiceProfileId } from './utils/speech';

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    appName: 'WhatsApp',
    actionTitle: 'Replied to a message',
    appCategory: 'AI Assistant',
    timestamp: '2 minutes ago',
    iconName: 'whatsapp',
    iconColor: 'emerald',
    iconBg: 'from-emerald-500/20 to-slate-900',
    taskType: 'whatsapp_reply',
    promptSnippet: 'Hey are you free for the quick sync on the Android AI update?',
    outputSnippet:
      'Yes! I am available right now. Let me pull up the build.gradle.kts and Gemini integration notes so we can walk through the text processing pipeline.',
  },
  {
    id: 'act-2',
    appName: 'Facebook',
    actionTitle: 'Posted on Facebook',
    appCategory: 'Social Media',
    timestamp: '12 minutes ago',
    iconName: 'facebook',
    iconColor: 'blue',
    iconBg: 'from-blue-600/20 to-slate-900',
    taskType: 'facebook_post',
    promptSnippet: 'Excited about modern AI agents and how personal AI is transforming daily workflows.',
    outputSnippet:
      '🚀 The future of personal productivity has arrived! With on-device and cloud Gemini intelligence, handling daily communications and content creation has never been smoother. #AIAssistant #TechInnovation #Productivity',
  },
  {
    id: 'act-3',
    appName: 'Phone',
    actionTitle: 'Called Mom',
    appCategory: 'Phone & SMS',
    timestamp: '25 minutes ago',
    iconName: 'phone',
    iconColor: 'emerald',
    iconBg: 'from-emerald-600/20 to-slate-900',
    taskType: 'phone_sms',
    promptSnippet: 'Follow-up message after 15 min phone conversation with Mom.',
    outputSnippet:
      'Salam Ammi! Reaching home by 7:30 PM today. Let me know if you need anything from the grocery store along the way!',
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      'Assalam o Alaikum Abu! Main Riyaz AI hoon. Aaj main aap ki کیا madad karoon?',
    timestamp: 'Just now',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatLoading, setChatLoading] = useState(false);

  // Modals & Panels state
  const [selectedApp, setSelectedApp] = useState<AppTile | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedWidgetTab, setSelectedWidgetTab] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfileId>(getStoredVoiceProfileId);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.setSoundEnabled(nextState);
  };

  const handleSelectWidget = (widgetId: string) => {
    setSelectedWidgetTab(widgetId);
    setSettingsModalOpen(true);
  };

  const handleActivityCreated = (newAct: ActivityItem) => {
    setActivities([newAct, ...activities]);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleRerunActivity = (activity: ActivityItem) => {
    const targetApp = APPS_DATA.find((a) => a.id === activity.iconName) || APPS_DATA[0];
    setSelectedApp(targetApp);
  };

  // Send message to Gemini chat endpoint
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to communicate with Riyaz AI');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.text,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantMsg]);
      sound.playSuccess();
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Error: ${err.message || 'Could not complete request. Please ensure Gemini API is available.'}`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handling voice input submitted
  const handleVoiceInput = (text: string) => {
    // Switch to Chat or trigger text processing
    setCurrentTab('chat');
    handleSendMessage(text);
  };

  // Execute WorkManager background task simulation
  const handleRunTask = async (task: BackgroundTask) => {
    try {
      const res = await fetch('/api/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'summarize',
          inputText: `Task: ${task.title}. ${task.description}`,
          tone: 'professional',
        }),
      });
      const data = await res.json();
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        appName: task.targetApp,
        actionTitle: `Auto-Executed: ${task.title}`,
        appCategory: 'WorkManager 2.9.0',
        timestamp: 'Just now',
        iconName: task.targetApp.toLowerCase().includes('whatsapp') ? 'whatsapp' : 'phone',
        iconColor: 'cyan',
        iconBg: 'from-blue-600/20 to-slate-900',
        taskType: 'summarize',
        promptSnippet: task.title,
        outputSnippet: data.result || 'Task completed successfully in background.',
      };
      setActivities([newAct, ...activities]);
    } catch {}
  };

  return (
    <DeviceFrame soundEnabled={soundEnabled} onToggleSound={handleToggleSound}>
      <div className="flex-1 flex flex-col h-full bg-[#040816] text-slate-100 relative">
        {/* Top App Bar Header matching Screenshot */}
        <header className="px-4 py-2 flex items-center justify-between shrink-0 select-none border-b border-cyan-500/15 bg-[#050b1d]/80 backdrop-blur-md z-30">
          {/* Hamburger Menu Icon */}
          <button
            onClick={() => {
              sound.playChirp();
              setDrawerOpen(true);
            }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo Brand: Glowing Sparkle + RIYAZ AI + Subtitle */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('home')}>
            {/* Cyan 4-pointed Sparkle Logo */}
            <div className="w-6 h-6 flex items-center justify-center text-cyan-400 filter drop-shadow-[0_0_8px_#22d3ee]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-sm font-extrabold tracking-wider text-white">
                  RIYAZ
                </span>
                <span className="text-sm font-extrabold tracking-wider text-cyan-400">
                  AI
                </span>
              </div>
              <span className="text-[9px] font-medium text-slate-400 tracking-tight leading-none mt-0.5">
                Your Personal AI Agent
              </span>
            </div>
          </div>

          {/* Right Controls: Pro Crown Badge + Settings Icon */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform cursor-pointer"
            >
              <Crown className="w-3 h-3 fill-amber-400" />
              <span className="text-[11px]">Pro</span>
            </button>

            <button
              onClick={() => {
                sound.playChirp();
                setSelectedWidgetTab('general');
                setSettingsModalOpen(true);
              }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab Body View */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col pb-20">
          {currentTab === 'home' && (
            <div className="flex flex-col px-3.5 py-2">
              {/* Greeting Card matching HomeDashboardScreen.kt & Screenshot */}
              <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#111524] via-[#0d1326] to-[#111524] border border-[#1E283D] shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex items-center justify-between gap-3 select-none mb-2">
                {/* User Avatar with Glowing NeonPurple / NeonMagenta Border */}
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#FF007F] to-[#8A00FF] p-0.5 shrink-0 shadow-[0_0_15px_rgba(138,0,255,0.5)]">
                  <div className="w-full h-full rounded-full bg-[#070913] flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Greeting Text from HomeDashboardScreen.kt */}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white tracking-wide">
                    Assalam o Alaikum, Abu!
                  </div>
                  <div className="text-[11px] text-[#00F0FF] font-medium leading-snug mt-0.5">
                    RIYAZ AI — Your Personal AI Agent
                  </div>
                  <div className="text-[10px] text-[#8E9BAE] mt-0.5">
                    Urdu, Roman Urdu & English Supported
                  </div>
                </div>

                {/* Online Status Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>

              {/* Holographic Mascot Stage with Orbiting Telemetry */}
              <div className="relative w-full my-1">
                {/* Telemetry widgets positioned on left and right */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between">
                  <div className="w-full pointer-events-auto">
                    <TelemetryWidget onSelectWidget={handleSelectWidget} />
                  </div>
                </div>

                {/* Mascot Core in Center */}
                <div className="relative z-10 flex justify-center">
                  <HologramMascot
                    onTapToSpeak={() => setVoiceModalOpen(true)}
                    isProcessing={chatLoading}
                  />
                </div>
              </div>

              {/* App Integration & Text Processing Grid */}
              <div className="mt-1">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-xs font-bold text-white tracking-wide">
                    AI Modules Engine
                  </span>
                  <span className="text-[10px] text-[#8E9BAE]">8 Modules Ready</span>
                </div>
                <AppGrid onSelectApp={(app) => setSelectedApp(app)} />
              </div>

              {/* System Health Status Card from HomeDashboardScreen.kt */}
              <div className="w-full my-2 p-3.5 rounded-2xl bg-[#111524] border border-[#1E283D] shadow-sm select-none">
                <div className="text-xs font-bold text-[#8A00FF] mb-2 flex items-center justify-between">
                  <span>System Status</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <div className="space-y-1 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                    <span>Gemini 3.8 Flash Engine: <strong className="text-emerald-400 font-semibold">Connected & Ready</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A00FF]" />
                    <span>Background Service: <strong className="text-emerald-400 font-semibold">Active (WorkManager 2.9.0)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F]" />
                    <span>Permissions: <strong className="text-emerald-400 font-semibold">Configured (6 of 6 Granted)</strong></span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="mt-1">
                <RecentActivity
                  activities={activities}
                  onSelectActivity={(act) => setSelectedActivity(act)}
                  onViewAll={() => setCurrentTab('tasks')}
                />
              </div>
            </div>
          )}

          {currentTab === 'chat' && (
            <ChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              onClearChat={() => setMessages(INITIAL_MESSAGES)}
              onOpenVoice={() => setVoiceModalOpen(true)}
              isLoading={chatLoading}
              onBack={() => setCurrentTab('home')}
              voiceProfile={voiceProfile}
              onOpenVoiceSettings={() => {
                setSelectedWidgetTab('voice');
                setSettingsModalOpen(true);
              }}
            />
          )}

          {currentTab === 'tasks' && <TasksView onRunTask={handleRunTask} />}

          {currentTab === 'profile' && (
            <ProfileView
              onNavigateRoute={(route) => {
                if (route === 'dashboard') setCurrentTab('home');
                else if (route === 'chat') setCurrentTab('chat');
                else if (route === 'voice') setVoiceModalOpen(true);
                else if (route === 'whatsapp') {
                  const wa = APPS_DATA.find((a) => a.id === 'whatsapp');
                  if (wa) setSelectedApp(wa);
                } else if (route === 'social') {
                  const fb = APPS_DATA.find((a) => a.id === 'facebook');
                  if (fb) setSelectedApp(fb);
                } else if (route === 'phone') {
                  const ph = APPS_DATA.find((a) => a.id === 'phone');
                  if (ph) setSelectedApp(ph);
                } else if (route === 'tasks') setCurrentTab('tasks');
                else if (route === 'permissions') {
                  setSelectedWidgetTab('permissions');
                  setSettingsModalOpen(true);
                } else if (route === 'settings') {
                  setSelectedWidgetTab('general');
                  setSettingsModalOpen(true);
                }
              }}
            />
          )}
        </main>

        {/* Bottom Navigation Bar with Floating Mic Button */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#040816]/95 backdrop-blur-xl border-t border-cyan-500/20 px-6 flex items-center justify-between z-30 select-none shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
          {/* Home Tab */}
          <button
            onClick={() => {
              sound.playChirp();
              setCurrentTab('home');
            }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              currentTab === 'home' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          {/* Chat Tab */}
          <button
            onClick={() => {
              sound.playChirp();
              setCurrentTab('chat');
            }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              currentTab === 'chat' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Chat</span>
          </button>

          {/* Center Floating Glowing Mic Action Button matching Screenshot */}
          <div className="relative -top-4 flex items-center justify-center">
            {/* Outer neon glowing aura rings */}
            <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-blue-600 blur-md opacity-70 animate-pulse-glow" />

            {/* Glowing concentric ring button */}
            <button
              onClick={() => {
                sound.playActivate();
                setVoiceModalOpen(true);
              }}
              className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-fuchsia-600 p-0.5 shadow-[0_0_25px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0b1533] to-[#040919] flex items-center justify-center border border-cyan-300/60">
                <Mic className="w-6 h-6 text-cyan-300 filter drop-shadow-[0_0_6px_#22d3ee]" />
              </div>
            </button>
          </div>

          {/* Tasks Tab */}
          <button
            onClick={() => {
              sound.playChirp();
              setCurrentTab('tasks');
            }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              currentTab === 'tasks' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Tasks</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => {
              sound.playChirp();
              setCurrentTab('profile');
            }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              currentTab === 'profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </nav>

        {/* Drawer Menu */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[85%] h-full bg-[#060c1f] border-r border-cyan-500/30 p-5 flex flex-col text-slate-100 z-10 shadow-2xl">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-cyan-400">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white">RIYAZ AI Agent</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="py-4 space-y-2 flex-1 text-xs">
                <button
                  onClick={() => {
                    setCurrentTab('home');
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span>Dashboard Home</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('chat');
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>AI Conversation</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('tasks');
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>WorkManager Tasks</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('profile');
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>Profile & SDK Config</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedWidgetTab('general');
                    setSettingsModalOpen(true);
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>Model Settings</span>
                </button>
              </div>

              {/* Drawer Footer */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Version</span>
                  <span className="text-cyan-300 font-mono">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target SDK</span>
                  <span className="text-emerald-400 font-mono">Android 34</span>
                </div>
                <button
                  onClick={() => {
                    setActivities(INITIAL_ACTIVITIES);
                    sound.playSuccess();
                    setDrawerOpen(false);
                  }}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text Processing Studio Modal */}
        {selectedApp && (
          <TextProcessingModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onActivityCreated={handleActivityCreated}
            voiceProfile={voiceProfile}
          />
        )}

        {/* Voice Prompt Modal */}
        <VoiceModal
          isOpen={voiceModalOpen}
          onClose={() => setVoiceModalOpen(false)}
          onSubmitVoiceText={handleVoiceInput}
        />

        {/* Settings & Telemetry Modal with Voice Profiles */}
        <SettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          activeWidgetTab={selectedWidgetTab}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          selectedVoiceProfile={voiceProfile}
          onSelectVoiceProfile={setVoiceProfile}
        />

        {/* Activity Detail Inspection Modal */}
        {selectedActivity && (
          <ActivityDetailModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
            onDelete={handleDeleteActivity}
            onRerun={handleRerunActivity}
            voiceProfile={voiceProfile}
          />
        )}
      </div>
    </DeviceFrame>
  );
}
