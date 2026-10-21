import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Send, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitVoiceText: (text: string) => void;
}

const VOICE_SHORTCUTS = [
  'Draft a polite WhatsApp reply to my manager',
  'Write an engaging Facebook post about AI productivity',
  'Summarize key talking points for my team standup',
  'Translate "Assalam o Alaikum, how are you today?" to English and Urdu',
];

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmitVoiceText,
}) => {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Attempt Web Speech API initialization
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          if (current) {
            setTranscript(current);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleMic = () => {
    sound.playChirp();
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
    } else {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (event: any) => {
            let current = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            if (current) setTranscript(current);
          };
          rec.start();
          recognitionRef.current = rec;
          setIsListening(true);
        } catch {
          setIsListening(false);
        }
      }
    }
  };

  const handleSend = () => {
    if (!transcript.trim()) return;
    sound.playSuccess();
    onSubmitVoiceText(transcript.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#060c1d] border border-cyan-500/30 p-6 flex flex-col items-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Riyaz Voice Engine
        </div>
        <h3 className="text-lg font-bold text-white mb-6">
          {isListening ? 'Listening to your command...' : 'Tap Mic or Type Prompt'}
        </h3>

        {/* Big Glowing Microphone Orb */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Animated concentric pulse rings */}
          {isListening && (
            <>
              <div className="absolute w-36 h-36 rounded-full border border-cyan-400/30 animate-ping opacity-30" />
              <div className="absolute w-44 h-44 rounded-full border border-fuchsia-500/25 animate-pulse-glow" />
            </>
          )}

          {/* Outer ring button */}
          <button
            onClick={toggleMic}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${
              isListening
                ? 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-600 shadow-[0_0_35px_rgba(6,182,212,0.7)] scale-105'
                : 'bg-slate-800 border-2 border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <MicOff className="w-10 h-10 text-slate-400" />
            )}
          </button>
        </div>

        {/* Equalizer soundwave indicator */}
        <div className="flex items-center gap-1 h-6 my-2">
          {[40, 70, 95, 60, 85, 50, 75, 45, 90, 65].map((val, i) => (
            <span
              key={i}
              className={`w-1 bg-gradient-to-t from-cyan-400 to-fuchsia-400 rounded-full transition-all duration-150 ${
                isListening ? 'animate-[waveBar_0.6s_ease-in-out_infinite]' : 'h-1.5 opacity-30'
              }`}
              style={{
                animationDelay: `${i * 0.08}s`,
                height: isListening ? `${val}%` : '4px',
              }}
            />
          ))}
        </div>

        {/* Live Transcript / Input Area */}
        <div className="w-full mt-3">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              isListening
                ? 'Speak clearly into your microphone...'
                : 'Type prompt or select a shortcut below...'
            }
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400 text-center placeholder:text-slate-500"
          />
        </div>

        {/* Send Button */}
        {transcript.trim() && (
          <button
            onClick={handleSend}
            className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Process with Riyaz AI
          </button>
        )}

        {/* Quick Voice Shortcuts */}
        <div className="w-full mt-4 pt-3 border-t border-slate-800">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Try saying or tapping:
          </div>
          <div className="flex flex-col gap-1.5">
            {VOICE_SHORTCUTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playChirp();
                  setTranscript(item);
                }}
                className="text-left text-[11px] p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800 text-slate-300 hover:text-cyan-200 transition-colors truncate cursor-pointer"
              >
                "{item}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
