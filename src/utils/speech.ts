// AI Assistant Voice Synthesis & Profiles Engine
// Supports 'Professional', 'Casual', 'Friendly', and 'Direct & Fast' profiles

export type VoiceProfileId = 'professional' | 'casual' | 'friendly' | 'energetic';

export interface VoiceProfile {
  id: VoiceProfileId;
  name: string;
  tagline: string;
  description: string;
  pitch: number;
  rate: number;
  volume: number;
  previewText: string;
  badge: string;
  color: string;
  bgLight: string;
  borderColor: string;
}

export const VOICE_PROFILES: Record<VoiceProfileId, VoiceProfile> = {
  professional: {
    id: 'professional',
    name: 'Professional',
    tagline: 'Articulate, Measured & Executive',
    description: 'Structured, confident delivery optimized for business correspondence, formal reports, and technical tasks.',
    pitch: 0.95,
    rate: 1.0,
    volume: 1.0,
    previewText: 'Assalam o Alaikum. Riyaz AI is ready to draft your executive briefings, analyze data, and manage schedules with precision.',
    badge: 'Executive',
    color: '#00F0FF',
    bgLight: 'rgba(0, 240, 255, 0.12)',
    borderColor: 'rgba(0, 240, 255, 0.35)',
  },
  casual: {
    id: 'casual',
    name: 'Casual',
    tagline: 'Relaxed, Natural & Modern',
    description: 'Smooth and conversational rhythm ideal for daily brainstorming, social captions, and casual chats.',
    pitch: 1.05,
    rate: 1.1,
    volume: 1.0,
    previewText: 'Hey there! Riyaz AI here. What are we tackling today? Let us get through your to-do list together!',
    badge: 'Everyday',
    color: '#8A00FF',
    bgLight: 'rgba(138, 0, 255, 0.12)',
    borderColor: 'rgba(138, 0, 255, 0.35)',
  },
  friendly: {
    id: 'friendly',
    name: 'Friendly',
    tagline: 'Warm, Supportive & Bilingual',
    description: 'Cheerful and empathetic tone with natural warmth, perfect for WhatsApp family replies and friendly greetings.',
    pitch: 1.18,
    rate: 0.98,
    volume: 1.0,
    previewText: 'Assalam o Alaikum dost! Main Riyaz AI hoon. How are you feeling today? I am always right here for you!',
    badge: 'Warm & Urdu',
    color: '#FF007F',
    bgLight: 'rgba(255, 0, 127, 0.12)',
    borderColor: 'rgba(255, 0, 127, 0.35)',
  },
  energetic: {
    id: 'energetic',
    name: 'Direct & Fast',
    tagline: 'Concise, Rapid & Focused',
    description: 'High-speed audio briefings tailored for rapid multitasking and power users who need instant answers.',
    pitch: 1.0,
    rate: 1.25,
    volume: 1.0,
    previewText: 'Riyaz AI operational. Briefing incoming: task completed in four hundred milliseconds. Ready for your next command.',
    badge: 'Power User',
    color: '#10B981',
    bgLight: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
};

const STORAGE_KEY = 'riyaz_ai_voice_profile';

export const getStoredVoiceProfileId = (): VoiceProfileId => {
  if (typeof window === 'undefined') return 'friendly';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as VoiceProfileId;
    if (saved && VOICE_PROFILES[saved]) {
      return saved;
    }
  } catch {}
  return 'friendly';
};

export const setStoredVoiceProfileId = (id: VoiceProfileId): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
};

/**
 * Clean text for high quality Text-to-Speech
 */
export const cleanTextForTTS = (text: string): string => {
  return text
    .replace(/[#*`_~]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/https?:\/\/\S+/g, 'link')
    .trim();
};

/**
 * Speak text using Web Speech API with selected profile parameters
 */
export const speakWithProfile = (
  text: string,
  profileId: VoiceProfileId = getStoredVoiceProfileId(),
  onStart?: () => void,
  onEnd?: () => void
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const profile = VOICE_PROFILES[profileId] || VOICE_PROFILES.friendly;
    const cleanText = cleanTextForTTS(text);
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = profile.rate;
    utterance.pitch = profile.pitch;
    utterance.volume = profile.volume;

    // Pick best available voice matching language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (profileId === 'friendly') {
        // Try warm English or Urdu/Indian English accent if available
        const warmVoice = voices.find(
          (v) =>
            v.lang.includes('ur') ||
            v.lang.includes('hi') ||
            v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira')
        );
        if (warmVoice) utterance.voice = warmVoice;
      } else if (profileId === 'professional') {
        const proVoice = voices.find(
          (v) =>
            v.name.includes('Guy') ||
            v.name.includes('David') ||
            v.name.includes('Daniel') ||
            v.name.includes('Google UK English Male') ||
            v.lang.startsWith('en-GB') ||
            v.lang.startsWith('en-US')
        );
        if (proVoice) utterance.voice = proVoice;
      }
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
};

export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
};
