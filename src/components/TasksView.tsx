import React, { useState } from 'react';
import {
  Calendar,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  RefreshCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { BackgroundTask } from '../types';

interface TasksViewProps {
  onRunTask: (task: BackgroundTask) => Promise<void>;
}

export const INITIAL_TASKS: BackgroundTask[] = [
  {
    id: 'task-1',
    title: 'Daily WhatsApp Catch-Up Digest',
    targetApp: 'WhatsApp AI',
    schedule: 'Every Morning at 8:30 AM',
    status: 'Running',
    lastRun: 'Today, 8:30 AM',
    description:
      'Summarizes incoming chats into 3 bullet points with recommended 1-tap quick replies.',
  },
  {
    id: 'task-2',
    title: 'Facebook Tech Trends Post Drafter',
    targetApp: 'Facebook Media',
    schedule: 'Mon, Wed, Fri at 12:00 PM',
    status: 'Scheduled',
    lastRun: 'Yesterday, 12:00 PM',
    description:
      'Generates an engaging, high-reach social post with hook and hashtags ready for approval.',
  },
  {
    id: 'task-3',
    title: 'Evening Call & SMS Log Follow-Up',
    targetApp: 'Phone & SMS',
    schedule: 'Every Evening at 7:00 PM',
    status: 'Idle',
    lastRun: 'Yesterday, 7:00 PM',
    description:
      'Auto-drafts follow-up SMS messages for unanswered or missed calls and business inquiries.',
  },
  {
    id: 'task-4',
    title: 'Urdu & English Daily Vocabulary Memo',
    targetApp: 'Language & More',
    schedule: 'Daily at 10:00 PM',
    status: 'Scheduled',
    lastRun: 'Yesterday, 10:00 PM',
    description:
      'Provides daily polished phrases and translations for professional communication.',
  },
];

export const TasksView: React.FC<TasksViewProps> = ({ onRunTask }) => {
  const [tasks, setTasks] = useState<BackgroundTask[]>(INITIAL_TASKS);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newApp, setNewApp] = useState('WhatsApp AI');
  const [newSchedule, setNewSchedule] = useState('Daily at 9:00 AM');
  const [taskResult, setTaskResult] = useState<{ id: string; text: string } | null>(null);

  const handleExecute = async (task: BackgroundTask) => {
    sound.playActivate();
    setRunningId(task.id);
    try {
      await onRunTask(task);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, lastRun: 'Just now', status: 'Completed' } : t))
      );
    } finally {
      setRunningId(null);
    }
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    const created: BackgroundTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      targetApp: newApp,
      schedule: newSchedule,
      status: 'Scheduled',
      lastRun: 'Never',
      description: `Automated AI text processing worker scheduled for ${newSchedule}.`,
    };
    setTasks([created, ...tasks]);
    setNewTitle('');
    setShowNewTaskModal(false);
    sound.playSuccess();
  };

  return (
    <div className="flex flex-col h-full bg-[#040816] select-none text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              AI Automated Tasks
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              WorkManager 2.9.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Background workers powering automated text processing
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* WorkManager Telemetry Banner */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/25 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">Android Background Executor</div>
            <div className="text-[11px] text-cyan-400">
              3 Workers Active • Battery Optimized (Doze Compliant)
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
          <span className="text-[11px] font-medium text-emerald-400">Syncing</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3.5 rounded-2xl bg-slate-900/70 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col gap-2.5 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {task.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      task.status === 'Running'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : task.status === 'Completed'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Target: <strong className="text-slate-300">{task.targetApp}</strong> • Schedule: {task.schedule}
                </div>
              </div>

              <button
                onClick={() => handleExecute(task)}
                disabled={runningId === task.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-xs font-semibold disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
              >
                {runningId === task.id ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-cyan-300" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-cyan-300" />
                    <span>Run Now</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/40 p-2 rounded-xl border border-slate-800">
              {task.description}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Last execution: {task.lastRun}</span>
              <span className="text-cyan-400/80">Gemini 3.8 Flash Worker</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#081028] border border-cyan-500/40 p-5 space-y-3.5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create WorkManager Task</h3>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Task Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Daily Telegram Summary"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Target Application:</label>
              <select
                value={newApp}
                onChange={(e) => setNewApp(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-white"
              >
                <option value="WhatsApp AI">WhatsApp AI</option>
                <option value="Facebook Media">Facebook Media</option>
                <option value="YouTube Content">YouTube Content</option>
                <option value="Instagram Social">Instagram Social</option>
                <option value="Phone & SMS">Phone & SMS</option>
                <option value="Language & More">Language & More</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Schedule Interval:</label>
              <input
                type="text"
                value={newSchedule}
                onChange={(e) => setNewSchedule(e.target.value)}
                placeholder="e.g. Every 4 hours"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
