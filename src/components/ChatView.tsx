import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  Mic,
  ArrowDown,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ChatMessage } from '../types';
import {
  VoiceProfileId,
  VOICE_PROFILES,
  speakWithProfile,
  stopSpeech,
  getStoredVoiceProfileId,
} from '../utils/speech';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  onOpenVoice: () => void;
  isLoading: boolean;
  onBack?: () => void;
  voiceProfile?: VoiceProfileId;
  onOpenVoiceSettings?: () => void;
}

const CHAT_SUGGESTIONS = [
  'How can I help you automate text replies today?',
  'Draft a polite decline email to an invitation',
  'Summarize 5 key trends in AI agents for 2026',
  'Translate "Thank you for your continuous support" to Urdu',
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  onOpenVoice,
  isLoading,
  onBack,
  voiceProfile = 'friendly',
  onOpenVoiceSettings,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    sound.playChirp();
    await onSendMessage(text);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    sound.playChirp();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeech();
      setSpeakingMsgId(null);
      return;
    }
    stopSpeech();
    sound.playChirp();
    setSpeakingMsgId(msgId);
    speakWithProfile(
      text,
      voiceProfile,
      () => setSpeakingMsgId(msgId),
      () => setSpeakingMsgId(null)
    );
  };

  const activeProfile = VOICE_PROFILES[voiceProfile] || VOICE_PROFILES.friendly;

  return (
    <div className="flex flex-col h-full bg-[#070913] select-none text-white">
      {/* Chat Top Header matching AIChatScreen.kt */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111524] border-b border-[#1E283D] shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-[#00F0FF] tracking-wide">
            RIYAZ AI Engine
          </h2>
          <span className="text-[10px] font-mono text-[#00F0FF] bg-[#070913] px-2 py-0.5 rounded border border-[#00F0FF]/30">
            Gemini 3.8
          </span>
          {onOpenVoiceSettings && (
            <button
              onClick={onOpenVoiceSettings}
              type="button"
              className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer hover:opacity-90"
              style={{
                color: activeProfile.color,
                borderColor: activeProfile.borderColor,
                backgroundColor: activeProfile.bgLight,
              }}
              title="Click to change Assistant Voice Profile"
            >
              <Volume2 className="w-2.5 h-2.5" />
              <span>Voice: {activeProfile.name}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={() => {
                sound.playChirp();
                onBack();
              }}
              className="text-xs font-semibold text-[#8E9BAE] hover:text-[#00F0FF] px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            onClick={onClearChat}
            title="Clear conversation"
            className="p-1.5 rounded-lg bg-[#070913] hover:bg-[#1a223a] text-[#8E9BAE] hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-start gap-2 max-w-[85%]">
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[280px] ${
                  msg.role === 'user'
                    ? 'bg-[#8A00FF] text-white shadow-[0_4px_15px_rgba(138,0,255,0.3)]'
                    : 'bg-[#111524] border border-[#1E283D] text-white shadow-[0_4px_15px_rgba(0,0,0,0.4)]'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Assistant message action tools */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-[#1E283D] text-[10px] text-[#8E9BAE]">
                    <span>{msg.timestamp}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                          speakingMsgId === msg.id
                            ? 'text-cyan-300 bg-cyan-950/80 ring-1 ring-cyan-400'
                            : 'hover:text-[#00F0FF]'
                        }`}
                        title={
                          speakingMsgId === msg.id
                            ? 'Stop reading'
                            : `Read aloud with ${activeProfile.name} voice profile`
                        }
                      >
                        {speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                            <div className="flex items-center gap-0.5">
                              <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-bounce" />
                              <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                              <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            </div>
                          </>
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-[#00F0FF] transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2 max-w-[280px]">
            <div className="w-7 h-7 rounded-full bg-[#111524] border border-[#00F0FF]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-spin" />
            </div>
            <div className="p-3.5 rounded-xl bg-[#111524] border border-[#1E283D] text-xs text-[#00F0FF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span>Gemini processing prompt...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-[#1E283D] bg-[#070913]">
          <div className="text-[10px] text-[#8E9BAE] font-semibold uppercase tracking-wider mb-1.5">
            Suggested Prompts:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CHAT_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playChirp();
                  onSendMessage(item);
                }}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#111524] border border-[#1E283D] text-[11px] text-[#00F0FF] hover:border-[#00F0FF] transition-all shrink-0 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar matching AIChatScreen.kt */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#111524] border-t border-[#1E283D] flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={onOpenVoice}
          className="p-2.5 rounded-xl bg-[#070913] border border-[#1E283D] text-[#00F0FF] hover:border-[#00F0FF] transition-colors cursor-pointer"
          title="Voice prompt"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type in Roman Urdu or English..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#070913] border border-[#1E283D] text-xs text-white placeholder:text-[#8E9BAE] focus:outline-none focus:border-[#00F0FF]"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-[#00F0FF] text-[#070913] font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:shadow-[0_0_18px_rgba(0,240,255,0.7)] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
