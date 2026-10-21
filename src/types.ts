export type TabType = 'home' | 'chat' | 'tasks' | 'profile';

export type TaskType =
  | 'whatsapp_reply'
  | 'facebook_post'
  | 'youtube_script'
  | 'instagram_caption'
  | 'phone_sms'
  | 'camera_ocr'
  | 'summarize'
  | 'translate'
  | 'tone_polish'
  | 'custom';

export interface ActivityItem {
  id: string;
  appName: string;
  actionTitle: string;
  appCategory: string;
  timestamp: string;
  iconName: string;
  iconColor: string;
  iconBg: string;
  taskType: TaskType;
  promptSnippet: string;
  outputSnippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionSuggestions?: string[];
}

export interface BackgroundTask {
  id: string;
  title: string;
  targetApp: string;
  schedule: string;
  status: 'Running' | 'Scheduled' | 'Completed' | 'Idle';
  lastRun: string;
  description: string;
}

export interface SystemTelemetry {
  voiceStatus: 'Active' | 'Muted' | 'Listening';
  brainModel: string;
  permissions: 'All Set' | 'Pending';
  batteryLevel: number;
  networkStatus: string;
  backgroundStatus: 'Active' | 'Paused';
}
