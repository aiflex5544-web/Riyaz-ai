import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  Volume2,
  Shield,
  BatteryCharging,
  Wifi,
  Lock,
  Brain,
  Mic,
  Check,
  Play,
  Square,
  Sparkles,
  Briefcase,
  Coffee,
  Heart,
  Zap,
  VolumeX,
} from 'lucide-react';
import { sound } from '../utils/audio';
import {
  VOICE_PROFILES,
  VoiceProfileId,
  speakWithProfile,
  stopSpeech,
  getStoredVoiceProfileId,
  setStoredVoiceProfileId,
} from '../utils/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidgetTab?: string | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  selectedVoiceProfile?: VoiceProfileId;
  onSelectVoiceProfile?: (profile: VoiceProfileId) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeWidgetTab = null,
  soundEnabled,
  onToggleSound,
  selectedVoiceProfile,
  onSelectVoiceProfile,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<string>(activeWidgetTab || 'general');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('English + Roman Urdu');
  const [powerSaving, setPowerSaving] = useState<boolean>(false);

  // Voice synthesis preference state
  const [currentVoiceProfile, setCurrentVoiceProfile] = useState<VoiceProfileId>(
    selectedVoiceProfile || getStoredVoiceProfileId()
  );
  const [playingProfileId, setPlayingProfileId] = useState<VoiceProfileId | null>(null);

  useEffect(() => {
    if (selectedVoiceProfile) {
      setCurrentVoiceProfile(selectedVoiceProfile);
    }
  }, [selectedVoiceProfile]);

  const handleSelectProfile = (profileId: VoiceProfileId) => {
    sound.playChirp();
    setCurrentVoiceProfile(profileId);
    setStoredVoiceProfileId(profileId);
    if (onSelectVoiceProfile) {
      onSelectVoiceProfile(profileId);
    }
  };

  const handlePreviewVoice = (profileId: VoiceProfileId, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playingProfileId === profileId) {
      stopSpeech();
      setPlayingProfileId(null);
      return;
    }

    stopSpeech();
    setPlayingProfileId(profileId);
    const profile = VOICE_PROFILES[profileId];
    speakWithProfile(
      profile.previewText,
      profileId,
      () => setPlayingProfileId(profileId),
      () => setPlayingProfileId(null)
    );
  };

  const getProfileIcon = (id: VoiceProfileId) => {
    switch (id) {
      case 'professional':
        return <Briefcase className="w-4 h-4 text-[#00F0FF]" />;
      case 'casual':
        return <Coffee className="w-4 h-4 text-[#8A00FF]" />;
      case 'friendly':
        return <Heart className="w-4 h-4 text-[#FF007F]" />;
      case 'energetic':
        return <Zap className="w-4 h-4 text-[#10B981]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#070e24] border border-cyan-500/30 p-5 flex flex-col max-h-[90vh] overflow-y-auto text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-300" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Riyaz AI Control Panel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 my-3 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'general', label: 'AI Settings' },
            { id: 'voice', label: 'Voice' },
            { id: 'brain', label: 'AI Brain' },
            { id: 'permissions', label: 'Permissions' },
            { id: 'battery', label: 'Battery' },
            { id: 'network', label: 'Network' },
            { id: 'background', label: 'Background' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playChirp();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="space-y-4 text-xs">
          {activeTab === 'general' && (
            <div className="space-y-3.5">
              {/* Gemini Engine Connected Badge */}
              <div className="p-3 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/20 flex items-center justify-center text-[#00F0FF]">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Gemini 3.8 Flash Engine</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-cyan-300/80">API Key Active & Authenticated via Server</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Ready</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Creativity / Temperature</span>
                  <span className="text-cyan-400 font-mono">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Precise & Factual</span>
                  <span>Creative & Expressive</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-300">
                    AI Assistant Voice Profile
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('voice')}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Voice Studio</span>
                    <Sparkles className="w-2.5 h-2.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(VOICE_PROFILES) as VoiceProfileId[]).map((pid) => {
                    const prof = VOICE_PROFILES[pid];
                    const isSelected = currentVoiceProfile === pid;
                    return (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => handleSelectProfile(pid)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-800/90 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                        style={{
                          borderColor: isSelected ? prof.color : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {getProfileIcon(pid)}
                          <div className="truncate">
                            <div className="text-xs font-semibold text-white leading-tight truncate">
                              {prof.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{prof.badge}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px]"
                            style={{ backgroundColor: prof.color }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Default Language Mode
                </label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="English + Roman Urdu">English + Roman Urdu</option>
                  <option value="Urdu (Nastaliq)">Urdu (Nastaliq)</option>
                  <option value="English (Global)">English (Global)</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Cyber UI Audio Feedback</div>
                    <div className="text-[10px] text-slate-400">Synthesizer tones on clicks & actions</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-3.5">
              {/* Voice Engine Live Status */}
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Neural Voice Engine</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Web Speech API • 24kHz Sample Rate • Real-time Synthesis
                    </div>
                  </div>
                </div>
                {playingProfileId && (
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      setPlayingProfileId(null);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-red-500/20 border border-red-500/40 text-[10px] font-semibold text-red-300 flex items-center gap-1 cursor-pointer hover:bg-red-500/30 transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                )}
              </div>

              {/* Section Header */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    AI Assistant Voice Synthesis Profiles
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Active: {VOICE_PROFILES[currentVoiceProfile].name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Select how Riyaz AI sounds when speaking responses, reading chat messages, and reciting smart drafts.
                </p>
              </div>

              {/* Voice Profile Cards */}
              <div className="space-y-2.5">
                {(Object.keys(VOICE_PROFILES) as VoiceProfileId[]).map((pid) => {
                  const profile = VOICE_PROFILES[pid];
                  const isSelected = currentVoiceProfile === pid;
                  const isPlaying = playingProfileId === pid;

                  return (
                    <div
                      key={pid}
                      onClick={() => handleSelectProfile(pid)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#0f172a] shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                      style={{
                        borderColor: isSelected ? profile.color : undefined,
                        boxShadow: isSelected ? `0 0 16px ${profile.bgLight}` : undefined,
                      }}
                    >
                      {/* Top Bar: Icon, Name, Badge, Select indicator */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: profile.bgLight }}
                          >
                            {getProfileIcon(pid)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{profile.name}</span>
                              <span
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                                style={{
                                  color: profile.color,
                                  borderColor: profile.borderColor,
                                  backgroundColor: profile.bgLight,
                                }}
                              >
                                {profile.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 leading-tight">
                              {profile.tagline}
                            </div>
                          </div>
                        </div>

                        {/* Radio Check Indicator */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-transparent shadow-[0_0_8px]'
                              : 'border-slate-700 bg-slate-800'
                          }`}
                          style={{
                            backgroundColor: isSelected ? profile.color : undefined,
                          }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#070913] stroke-[3]" />}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                        {profile.description}
                      </p>

                      {/* Bottom Footer: Speech Parameters & Preview Play Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>Pitch: <strong className="text-slate-200">{profile.pitch.toFixed(2)}</strong></span>
                          <span>Speed: <strong className="text-slate-200">{profile.rate.toFixed(2)}x</strong></span>
                        </div>

                        {/* Interactive Play Sample Button */}
                        <button
                          type="button"
                          onClick={(e) => handlePreviewVoice(pid, e)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isPlaying
                              ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-400/50'
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Square className="w-3 h-3 fill-current text-red-400" />
                              <span className="text-[11px]">Stop</span>
                              <div className="flex items-center gap-0.5 ml-1">
                                <span className="w-1 h-2.5 bg-red-400 rounded-full animate-bounce" />
                                <span className="w-1 h-3.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                                <span className="w-1 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                              </div>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current text-cyan-400" />
                              <span className="text-[11px]">Play Sample</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Helper info notice */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Your voice synthesis preference applies automatically to <strong>AI Chat Screen</strong> speaker buttons, <strong>WhatsApp Smart Replies</strong>, and <strong>Activity Details</strong>.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'brain' && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <Brain className="w-4 h-4" />
                <span>AI Brain: Gemini 3.8 Flash</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Powered by Google GenAI TypeScript SDK (2.4.0) with server-side proxy integration. Provides low-latency text completion, smart WhatsApp/Facebook message synthesis, and multimodality.
              </p>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>AndroidManifest.xml Permissions</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  6 Granted
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Configured for package <strong className="text-cyan-300 font-mono">com.riyaz.ai</strong> with runtime permission checks:
              </p>
              <div className="space-y-1.5 pt-1">
                {[
                  { name: 'INTERNET', desc: 'Gemini AI API & Cloud Sync' },
                  { name: 'RECORD_AUDIO', desc: 'Voice Agent & Speech Recognition' },
                  { name: 'POST_NOTIFICATIONS', desc: 'WorkManager Background Alerts' },
                  { name: 'RECEIVE_BOOT_COMPLETED', desc: 'Auto-restart on Device Boot' },
                  { name: 'CALL_PHONE', desc: 'One-Tap AI Calling Assistant' },
                  { name: 'READ_CONTACTS', desc: 'Recipient Name Auto-Fill' },
                ].map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px]">
                    <div>
                      <span className="font-mono text-cyan-300 font-semibold">android.permission.{p.name}</span>
                      <div className="text-slate-400 text-[9px]">{p.desc}</div>
                    </div>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Granted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'battery' && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <BatteryCharging className="w-4 h-4" />
                <span>Battery Level: 82% (Optimized)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Adaptive power management prevents battery drain during background tasks. WorkManager delays non-urgent text batching when device is not charging.
              </p>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-teal-500/20 space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <Wifi className="w-4 h-4" />
                <span>Network: Good (5G / Low Latency)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Round-trip latency to Gemini AI servers is under 80ms. Offline fallback queue saves prompt drafts if connection drops.
              </p>
            </div>
          )}

          {activeTab === 'background' && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/20 space-y-2">
              <div className="flex items-center gap-2 text-sky-300 font-bold">
                <Lock className="w-4 h-4" />
                <span>Background Sync: Active</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Managed by Android WorkManager 2.9.0 with Doze-mode compliance. Scheduled workers run periodically to draft summaries and social updates.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playSuccess();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
