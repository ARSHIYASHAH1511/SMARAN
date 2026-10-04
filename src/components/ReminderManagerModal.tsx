/**
 * Smaran AI - Medication & Daily Activity Reminder Notification Manager
 * Allows patients and caregivers to set user-defined intervals, toggle alerts,
 * enable background notifications, and test alerts instantly.
 */

import React, { useState, useEffect } from 'react';
import {
  Reminder,
  ReminderCategory,
  reminderEngine,
  ReminderLog,
  getLocalizedReminderContent,
  unlockAudio,
} from '../lib/reminderEngine';
import {
  Bell,
  BellRing,
  Clock,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Play,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  History,
  Timer,
} from 'lucide-react';
import { Language } from '../lib/translations';

interface ReminderManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onTriggerTest?: (reminder: Reminder) => void;
}

export default function ReminderManagerModal({
  isOpen,
  onClose,
  lang = 'en',
  onTriggerTest,
}: ReminderManagerModalProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    reminderEngine.getNotificationPermission()
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<ReminderLog[]>([]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReminderCategory>('medication');
  const [newInterval, setNewInterval] = useState<number>(90);
  const [newNotes, setNewNotes] = useState('');
  const [newVoiceText, setNewVoiceText] = useState('');
  const [customIntervalInputs, setCustomIntervalInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsub = reminderEngine.subscribe((updated) => {
      setReminders(updated);
    });
    setNotificationPermission(reminderEngine.getNotificationPermission());
    try {
      const cachedLogs = JSON.parse(localStorage.getItem('Smaran_reminder_logs') || '[]');
      setLogs(cachedLogs);
    } catch (e) {
      console.warn('Logs load notice', e);
    }
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await reminderEngine.requestNotificationPermission();
    setNotificationPermission(perm);
  };

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    await reminderEngine.toggleReminder(id, !currentEnabled);
  };

  const handleIntervalChange = async (id: string, minutes: number) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;
    const updated: Reminder = {
      ...target,
      intervalMinutes: minutes,
      nextTriggerTime: Date.now() + minutes * 60 * 1000,
    };
    await reminderEngine.saveReminder(updated);
  };

  const handleToggleVoice = async (id: string, currentVoice: boolean) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;
    const updated: Reminder = {
      ...target,
      voiceAlert: !currentVoice,
    };
    await reminderEngine.saveReminder(updated);
  };

  const handleDelete = async (id: string) => {
    await reminderEngine.deleteReminder(id);
  };

  const handleTestAlert = (reminder: Reminder) => {
    unlockAudio();
    reminderEngine.triggerReminder(reminder, true);
    if (onTriggerTest) {
      onTriggerTest(reminder);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let icon = '🔔';
    let targetTab: Reminder['targetTab'] = 'home';
    if (newCategory === 'medication') icon = '💊';
    else if (newCategory === 'palace') {
      icon = '🗝️';
      targetTab = 'palace';
    } else if (newCategory === 'hydration') icon = '☕';
    else if (newCategory === 'activity') {
      icon = '🦏';
      targetTab = 'motif_match';
    } else if (newCategory === 'prayer') icon = '🔔';

    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      intervalType: 'interval',
      intervalMinutes: Number(newInterval) || 90,
      enabled: true,
      voiceAlert: true,
      voiceText: newVoiceText.trim() || newTitle.trim(),
      notes: newNotes.trim(),
      icon,
      targetTab,
      nextTriggerTime: Date.now() + (Number(newInterval) || 90) * 60 * 1000,
      createdAt: Date.now(),
    };

    await reminderEngine.saveReminder(newReminder);
    setNewTitle('');
    setNewNotes('');
    setNewVoiceText('');
    setNewInterval(90);
    setShowAddForm(false);
  };

  const formatRemainingTime = (nextTime: number) => {
    const diff = nextTime - Date.now();
    if (diff <= 0) return 'Due now';
    const minutes = Math.floor(diff / (60 * 1000));
    if (minutes < 60) return `in ${minutes} min${minutes === 1 ? '' : 's'}`;
    const hours = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    return `in ${hours}h ${remMins}m`;
  };

  return (
    <div
      id="reminder-manager-modal"
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-2xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl border border-stone-200 overflow-hidden relative">
        <div className="bg-white px-6 py-5 border-b border-stone-200 text-stone-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-700">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Medication & Activity Reminders</h2>
              <p className="text-stone-500 text-xs sm:text-sm font-medium">
                Set calm custom intervals for medicines, palace check-ins, and daily care.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#faf8f5]">
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              notificationPermission === 'granted'
                ? 'bg-stone-50 border-stone-200 text-stone-900'
                : notificationPermission === 'denied'
                ? 'bg-stone-50 border-stone-200 text-stone-800'
                : 'bg-stone-50 border-stone-200 text-stone-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {notificationPermission === 'granted' ? (
                <ShieldCheck className="w-6 h-6 text-stone-700 shrink-0" />
              ) : notificationPermission === 'denied' ? (
                <AlertTriangle className="w-6 h-6 text-stone-600 shrink-0" />
              ) : (
                <Bell className="w-6 h-6 text-stone-600 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {notificationPermission === 'granted'
                    ? 'Background Alerts Active (System Notifications Enabled)'
                    : notificationPermission === 'denied'
                    ? 'Browser Notifications Blocked'
                    : 'Enable Background Notifications'}
                </h4>
                <p className="text-xs text-stone-600 font-medium mt-0.5">
                  {notificationPermission === 'granted'
                    ? 'Alerts will gently notify you even when the app is in the background.'
                    : notificationPermission === 'denied'
                    ? 'Please allow notifications in your browser address bar to receive alerts.'
                    : 'Grant permission so medication and palace alerts reach you reliably.'}
                </p>
              </div>
            </div>
            {notificationPermission !== 'granted' && (
              <button
                id="btn-enable-notifications"
                onClick={handleRequestPermission}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shrink-0 shadow-2xs transition-colors"
              >
                Enable Background Alerts
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Active Reminders ({reminders.filter((r) => r.enabled).length} of {reminders.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <History className="w-3.5 h-3.5 text-stone-500" />
                <span>{showLogs ? 'Hide History' : 'Adherence History'}</span>
              </button>
              <button
                id="btn-add-reminder"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Cancel' : 'Add Custom Reminder'}</span>
              </button>
            </div>
          </div>

          {showLogs && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 shadow-2xs">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <History className="w-4 h-4 text-stone-600" />
                <span>Recent Daily Reminder Log & Adherence</span>
              </h4>
              {logs.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No alerts triggered yet today.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto divide-y divide-stone-100">
                  {logs.slice(0, 10).map((log) => (
                    <div key={log.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-stone-800">{log.title}</span>
                        <div className="text-[11px] text-stone-400">
                          Triggered at {new Date(log.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showAddForm && (
            <form
              onSubmit={handleCreateReminder}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3.5"
            >
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stone-600" />
                <span>Add Medication or Daily Activity Reminder</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Reminder Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Afternoon BP Tablet, Check Almirah Keys"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-none text-xs sm:text-sm font-medium bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ReminderCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-none text-xs sm:text-sm font-medium bg-stone-50 text-stone-800"
                  >
                    <option value="medication">💊 Medication</option>
                    <option value="palace">🗝️ 3D Memory Palace</option>
                    <option value="hydration">☕ Hydration & Tea</option>
                    <option value="activity">🦏 Cognitive / Brain Game</option>
                    <option value="prayer">🔔 Prayer & Evening Bell</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Trigger Interval (in minutes) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      required
                      value={newInterval}
                      onChange={(e) => setNewInterval(Number(e.target.value))}
                      className="w-24 p-2.5 rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-none text-xs sm:text-sm font-medium bg-stone-50"
                    />
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: '90m (Default)', val: 90 },
                        { label: '15m', val: 15 },
                        { label: '30m', val: 30 },
                        { label: '1h', val: 60 },
                        { label: '2h', val: 120 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setNewInterval(preset.val)}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                            newInterval === preset.val
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Spoken Voice Prompt
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please take your afternoon medicine with warm water."
                    value={newVoiceText}
                    onChange={(e) => setNewVoiceText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-none text-xs sm:text-sm font-medium bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Location or Preparation Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Located on the dining table next to the ginger tea cup."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-none text-xs sm:text-sm font-medium bg-stone-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 font-semibold text-stone-600 hover:bg-stone-50 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-2xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {reminders.map((rem) => {
              const isDueSoon = rem.enabled && rem.nextTriggerTime - Date.now() < 10 * 60 * 1000;
              return (
                <div
                  key={rem.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-2xs ${
                    rem.enabled
                      ? isDueSoon
                        ? 'border-stone-400 ring-1 ring-stone-300'
                        : 'border-stone-200 hover:border-stone-300'
                      : 'border-stone-200 opacity-60 bg-stone-50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-2xl shrink-0">
                        {rem.icon || '🔔'}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-stone-900 leading-tight">
                            {getLocalizedReminderContent(rem, lang).title}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border border-stone-200 bg-stone-100 text-stone-600">
                            {rem.category === 'palace' ? 'Memory Palace' : rem.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                          {getLocalizedReminderContent(rem, lang).notes || getLocalizedReminderContent(rem, lang).voiceText}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-stone-500 font-medium">
                          {rem.id === 'rem-daily-8am-open' || rem.scheduledTime === '08:00' ? (
                            <span className="flex items-center gap-1 text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              Every day at 8:00 AM (Daily Sanctuary Alarm)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-stone-700">
                              <Timer className="w-3.5 h-3.5" />
                              Every {rem.intervalMinutes} min{rem.intervalMinutes === 1 ? '' : 's'}
                            </span>
                          )}
                          <span>•</span>
                          <span className={isDueSoon ? 'text-stone-900 font-semibold' : 'text-stone-500'}>
                            Next alert: {rem.enabled ? formatRemainingTime(rem.nextTriggerTime) : 'Paused'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleTestAlert(rem)}
                        title="Test alert"
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3 h-3 text-stone-600 fill-stone-600" />
                        <span>Test</span>
                      </button>
                      <button
                        onClick={() => handleToggleVoice(rem.id, rem.voiceAlert)}
                        title={rem.voiceAlert ? 'Voice Announcement On' : 'Voice Announcement Off'}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          rem.voiceAlert
                            ? 'bg-stone-100 text-stone-800 border-stone-300'
                            : 'bg-stone-50 text-stone-400 border-stone-200'
                        }`}
                      >
                        {rem.voiceAlert ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleToggle(rem.id, rem.enabled)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all border ${
                          rem.enabled
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        {rem.enabled ? 'ACTIVE' : 'OFF'}
                      </button>
                      <button
                        onClick={() => handleDelete(rem.id)}
                        title="Delete reminder"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {rem.enabled && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-stone-500 mr-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Interval:
                      </span>
                      {[
                        { label: '90m (Default)', val: 90 },
                        { label: '15m', val: 15 },
                        { label: '30m', val: 30 },
                        { label: '1h', val: 60 },
                        { label: '2h', val: 120 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          onClick={() => handleIntervalChange(rem.id, preset.val)}
                          className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                            rem.intervalMinutes === preset.val
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}

                      <div className="flex items-center gap-1 ml-auto">
                        <input
                          type="number"
                          min="1"
                          max="1440"
                          placeholder="mins"
                          value={customIntervalInputs[rem.id] ?? ''}
                          onChange={(e) =>
                            setCustomIntervalInputs({
                              ...customIntervalInputs,
                              [rem.id]: Number(e.target.value),
                            })
                          }
                          className="w-14 px-1.5 py-0.5 text-xs border border-stone-200 rounded-md text-center font-medium bg-stone-50"
                        />
                        <button
                          onClick={() => {
                            const val = customIntervalInputs[rem.id];
                            if (val && val > 0) {
                              handleIntervalChange(rem.id, val);
                              setCustomIntervalInputs({ ...customIntervalInputs, [rem.id]: undefined as any });
                            }
                          }}
                          className="px-2 py-0.5 bg-stone-800 text-white text-xs font-medium rounded-md hover:bg-stone-900"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border-t border-stone-200 px-6 py-3.5 flex items-center justify-between">
          <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
            Background notifications & gentle alerts enabled.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
