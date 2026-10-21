import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Volume2,
  RefreshCw,
  Send,
  Upload,
  Image as ImageIcon,
  Sliders,
  ChevronDown,
  Users,
  PhoneCall,
  VolumeX,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { AppTile } from './AppGrid';
import { TaskType, ActivityItem } from '../types';
import {
  VoiceProfileId,
  VOICE_PROFILES,
  speakWithProfile,
  stopSpeech,
  getStoredVoiceProfileId,
} from '../utils/speech';

interface TextProcessingModalProps {
  app: AppTile | null;
  onClose: () => void;
  onActivityCreated: (activity: ActivityItem) => void;
  voiceProfile?: VoiceProfileId;
}

const TONES = [
  'Professional',
  'Friendly & Warm',
  'Casual & Punchy',
  'Urgent / Direct',
  'Humorous',
  'Urdu / Roman Urdu',
  'Persuasive',
];

const PRESET_PROMPTS: Record<string, string[]> = {
  whatsapp: [
    'Replying to boss: "Can you send the Q3 project budget report by 2 PM today?"',
    'Apologizing to a friend for missing dinner: "Hey so sorry I could not make it, had an unexpected emergency"',
    'Polite message to landlord: "Inquiring about fixing the water heater in the kitchen"',
  ],
  facebook: [
    'Launching a new AI app that helps automate daily messaging and content tasks',
    'Reflecting on remote work productivity tips for software engineers in 2026',
    'Weekend motivation post about consistency and learning new skills',
  ],
  youtube: [
    'Top 5 hidden AI tools in 2026 that will 10x your coding productivity',
    'How to build an Android companion agent with Gemini SDK step-by-step',
    'A day in the life of an AI prompt engineer in tech',
  ],
  instagram: [
    'Aesthetic sunset view over city skyline from a coffee shop workspace',
    'Fitness workout milestone: completed my first half-marathon',
    'Behind the scenes of designing a futuristic mobile agent interface',
  ],
  phone: [
    'Running 10 minutes late to the client meeting due to unexpected traffic',
    'Follow up after phone interview: thank you for your time and next steps',
    'Confirming dentist appointment for tomorrow at 11:30 AM',
  ],
  camera: [
    'Extract text and receipts from this restaurant bill and split total by 3 people',
    'Summarize this book page into 3 action bullet points',
    'Translate the text found on this product packaging to English and Urdu',
  ],
  more: [
    'Translate to Urdu and Roman Urdu: "The conference has been rescheduled to next Monday at 10 AM."',
    'Rewrite in executive corporate English: "We wanna make sure everything is working good before release."',
    'Summarize terms of service: "We collect analytics data and use cookies to improve user experience..."',
  ],
};

export const TextProcessingModal: React.FC<TextProcessingModalProps> = ({
  app,
  onClose,
  onActivityCreated,
  voiceProfile = getStoredVoiceProfileId(),
}) => {
  if (!app) return null;

  const [inputText, setInputText] = useState(
    PRESET_PROMPTS[app.id]?.[0] || 'Type or paste text to process...'
  );
  const [selectedTone, setSelectedTone] = useState(
    app.id === 'whatsapp' ? 'Friendly & Warm' : 'Professional'
  );
  const [language, setLanguage] = useState(
    app.id === 'more' ? 'Urdu & English' : 'English'
  );
  const [length, setLength] = useState<'brief' | 'medium' | 'comprehensive'>('medium');
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!inputText.trim() && !imagePreview) return;
    setLoading(true);
    setErrorMsg(null);
    sound.playActivate();

    try {
      const res = await fetch('/api/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: app.taskType,
          inputText,
          tone: selectedTone,
          language,
          length,
          imageData: imagePreview,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process text.');
      }

      setOutput(data.result);
      sound.playSuccess();

      // Add to recent activity feed
      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        appName: app.name,
        actionTitle:
          app.id === 'whatsapp'
            ? 'Drafted Smart Reply'
            : app.id === 'facebook'
            ? 'Generated Facebook Post'
            : app.id === 'youtube'
            ? 'Created Video Outline'
            : app.id === 'instagram'
            ? 'Crafted Instagram Caption'
            : app.id === 'phone'
            ? 'Composed SMS Follow-up'
            : app.id === 'camera'
            ? 'Extracted Text from Image'
            : 'Processed Text & Translation',
        appCategory: app.sublabel,
        timestamp: 'Just now',
        iconName: app.id,
        iconColor: 'cyan',
        iconBg: app.bgGradient,
        taskType: app.taskType,
        promptSnippet: inputText.slice(0, 80),
        outputSnippet: data.result.slice(0, 150),
      };
      onActivityCreated(newActivity);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while contacting Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    sound.playChirp();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!output || typeof window === 'undefined') return;
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    sound.playChirp();
    speakWithProfile(
      output,
      voiceProfile,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#070e22] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[#070e22]/90 backdrop-blur-md border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            {app.icon}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {app.name} Text Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-400">{app.sublabel} Automation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {/* Preset Prompts Buttons */}
          {PRESET_PROMPTS[app.id] && (
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Quick Templates:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PROMPTS[app.id].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playChirp();
                      setInputText(prompt);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800/70 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-slate-800 text-cyan-200 transition-all text-left cursor-pointer truncate max-w-full"
                  >
                    "{prompt.slice(0, 45)}..."
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Automation Card matching WhatsAppAssistantScreen.kt */}
          {app.id === 'whatsapp' && (
            <div className="p-3.5 rounded-2xl bg-[#111524] border border-[#1E283D] space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">WhatsApp Auto-Reply Automation</div>
                  <div className="text-[10px] text-[#8E9BAE]">NotificationListenerService Active</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="sr-only peer"
                    id="whatsapp-auto-reply-toggle"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F0FF]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-[#070913] border border-[#1E283D]">
                <span className="text-[#8E9BAE]">Status:</span>
                <span className="text-[#00F0FF] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                  Active & Monitoring Notifications
                </span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                  Selected Reply Style:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Roman Urdu / Friendly',
                    'Affectionate Family (Abu/Ammi)',
                    'Short & Direct',
                    'Corporate Professional',
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => {
                        sound.playChirp();
                        setSelectedTone(style);
                      }}
                      className={`p-2 rounded-xl text-[10px] font-medium border text-left transition-all ${
                        selectedTone === style
                          ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF] font-bold'
                          : 'bg-[#070913] border-[#1E283D] text-[#8E9BAE] hover:border-[#00F0FF]/40'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phone & SMS Control Card matching PhoneControlScreen */}
          {app.id === 'phone' && (
            <div className="p-3.5 rounded-2xl bg-[#111524] border border-[#1E283D] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#00F0FF]" />
                  <span>Phone & Device Control</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-[#070913] border border-[#1E283D]">
                  <div className="text-[#8E9BAE]">Battery</div>
                  <div className="text-emerald-400 font-bold text-xs mt-0.5">82% Healthy</div>
                </div>
                <div className="p-2 rounded-xl bg-[#070913] border border-[#1E283D]">
                  <div className="text-[#8E9BAE]">Network</div>
                  <div className="text-[#00F0FF] font-bold text-xs mt-0.5">5G VoLTE</div>
                </div>
                <div className="p-2 rounded-xl bg-[#070913] border border-[#1E283D]">
                  <div className="text-[#8E9BAE]">DND Mode</div>
                  <div className="text-[#FF007F] font-bold text-xs mt-0.5">Off</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Contact Auto-Targeting (READ_CONTACTS Permission) */}
          {(app.id === 'phone' || app.id === 'whatsapp') && (
            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  Target Contact (READ_CONTACTS):
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Sync Active</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {[
                  { name: 'Abu', relation: 'Father' },
                  { name: 'Ammi', relation: 'Mother' },
                  { name: 'Sarah Khan', relation: 'Lead' },
                  { name: 'David Miller', relation: 'Client' },
                  { name: 'Dr. Tariq', relation: 'Clinic' },
                ].map((contact, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.playChirp();
                      setInputText(
                        `Message to ${contact.name} (${contact.relation}): ${inputText.replace(
                          /^Message to [^:]+:\s*/,
                          ''
                        )}`
                      );
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400/60 text-[11px] text-cyan-200 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>{contact.name}</span>
                    <span className="text-[9px] text-slate-400">({contact.relation})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Camera OCR Image Upload if camera */}
          {app.id === 'camera' && (
            <div className="p-3 rounded-2xl border border-dashed border-sky-500/40 bg-sky-950/20 text-center">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="max-h-40 rounded-xl object-contain border border-cyan-500/40 mx-auto"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-900/40 border border-sky-400/40 flex items-center justify-center text-sky-300">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-300">
                    Click to upload document or photo for OCR
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Input Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Input Text / Prompt / Thread:
              </label>
              <span className="text-[10px] text-slate-400">
                {inputText.length} characters
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Enter message, bullet points, topic, or content..."
              className="w-full p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/25 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-xs text-slate-100 placeholder:text-slate-500 transition-all font-mono"
            />
          </div>

          {/* Tone & Options Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Tone Style:
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-cyan-500/25 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {TONES.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Output Length:
              </label>
              <div className="flex rounded-xl bg-slate-900 border border-cyan-500/25 p-0.5">
                {(['brief', 'medium', 'comprehensive'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`flex-1 py-1.5 text-[11px] font-medium capitalize rounded-lg transition-colors cursor-pointer ${
                      length === l
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {l === 'comprehensive' ? 'Detailed' : l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleProcess}
            disabled={loading || (!inputText.trim() && !imagePreview)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 font-bold text-white text-xs tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Processing with Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Generate & Refine with Riyaz AI</span>
              </>
            )}
          </button>

          {/* Error Message Display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Generated Result Output Box */}
          {output && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.2)] animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Riyaz AI Result:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeak}
                    title={isSpeaking ? 'Stop speaking' : `Read aloud with ${VOICE_PROFILES[voiceProfile]?.name || 'active'} voice`}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      isSpeaking
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-[10px] font-semibold text-red-300">Stop</span>
                      </>
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-100 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto pr-1">
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
