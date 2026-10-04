/**
 * FireFly AI - Daily Tasks & Reminders View
 * Dedicated screen separating medication alarms, reminder intervals,
 * and holistic circadian rituals for elder peace of mind.
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Settings2,
  Bell,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Sun,
} from 'lucide-react';
import {
  Reminder,
  reminderEngine,
  speakReminderText,
  playChimeSound,
} from '../lib/reminderEngine';
import { Language } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';
import DailyRituals from './DailyRituals';

interface DailyTasksViewProps {
  lang?: Language;
  onOpenReminderAlert: (rem: Reminder) => void;
  onOpenReminderManager: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function DailyTasksView({
  lang: propLang,
  onOpenReminderAlert,
  onOpenReminderManager,
  onNavigateTab,
}: DailyTasksViewProps) {
  const { lang: contextLang, t } = useLanguage();
  const lang = propLang || contextLang || 'en';
  const [reminders, setReminders] = useState<Reminder[]>(reminderEngine.getReminders());
  const [speechActive, setSpeechActive] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    reminderEngine.getNotificationPermission()
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'reminders' | 'rituals'>('all');
  const [justCheckedReminderId, setJustCheckedReminderId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = reminderEngine.subscribe((updated) => {
      setReminders([...updated]);
    });
    return () => unsub();
  }, []);

  const handleSpeakReminder = (rem: Reminder) => {
    setSpeechActive(rem.id);
    playChimeSound();
    speakReminderText(rem.voiceText || rem.title, lang);
    setTimeout(() => {
      setSpeechActive(null);
    }, 4000);
  };

  const handleMarkReminderDone = (e: React.MouseEvent, rem: Reminder) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 50]);
      } catch {
        // safe fallback
      }
    }
    try {
      playChimeSound();
    } catch {
      // safe fallback
    }
    setJustCheckedReminderId(rem.id);
    reminderEngine.markReminderCompleted(rem.id);
    setTimeout(() => {
      setJustCheckedReminderId((curr) => (curr === rem.id ? null : curr));
    }, 1200);
  };

  const handleRequestPermission = async () => {
    const perm = await reminderEngine.requestNotificationPermission();
    setNotificationPermission(perm);
  };

  const formatRemaining = (targetTime: number) => {
    const diffMs = targetTime - Date.now();
    if (diffMs <= 0) return t.actions.dueNow || 'Due now';
    const mins = Math.ceil(diffMs / (60 * 1000));
    if (mins < 60) return t.actions.inMinutes.replace('{m}', String(mins));
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return t.actions.inHoursMinutes.replace('{h}', String(hrs)).replace('{m}', String(remainMins));
  };

  const activeReminders = reminders.filter((r) => r.enabled);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-7 bg-[#faf8f5] min-h-screen pb-28">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌿</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {t.tabs.rituals || 'Daily Care & Reminders'}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-stone-600 font-medium max-w-2xl">
              {t.appTagline || 'Gentle daily anchors, scheduled medicines, and peaceful wellness routines.'}
            </p>
          </div>
          {/* Quick Filter Segment */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0 self-start md:self-center">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-stone-950 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Care
            </button>
            <button
              onClick={() => setActiveFilter('reminders')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === 'reminders'
                  ? 'bg-white text-stone-950 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-stone-700" />
              <span>{t.dashboard.urgentReminders || 'Reminders'}</span>
            </button>
            <button
              onClick={() => setActiveFilter('rituals')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === 'rituals'
                  ? 'bg-white text-stone-950 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-stone-700" />
              <span>{t.tabs.rituals || 'Rituals'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Scheduled Medication & Activity Reminders */}
      {(activeFilter === 'all' || activeFilter === 'reminders') && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-stone-900">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800" />
                <span>{t.dashboard.urgentReminders || 'Scheduled Reminders'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                {t.actions.repeatEvery90Min || 'Configured to repeat for continuous reliable care.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {notificationPermission !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl border border-stone-200 flex items-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-stone-600" />
                  <span>Enable Audio Alerts</span>
                </button>
              )}
              <button
                id="btn-open-reminder-manager"
                onClick={onOpenReminderManager}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{t.settings.configure || 'Configure'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeReminders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-stone-400 mx-auto" />
                <h4 className="text-base font-bold text-stone-700">No Reminders Active</h4>
                <p className="text-xs text-stone-500">
                  Tap "Configure" above to enable repeating alerts.
                </p>
              </div>
            ) : (
              activeReminders.map((rem) => {
                const isPalace = rem.category === 'palace';
                const isMed = rem.category === 'medication';
                const is8AM = rem.id === 'rem-daily-8am-open' || rem.scheduledTime === '08:00';
                const isJustDone = justCheckedReminderId === rem.id;
                return (
                  <div
                    key={rem.id}
                    className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                      isJustDone
                        ? 'border-stone-900 bg-stone-50 scale-[1.005]'
                        : is8AM
                        ? 'border-amber-300/80 bg-gradient-to-r from-amber-50/50 to-white hover:border-amber-400'
                        : 'border-stone-200/90 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                        is8AM ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-stone-100 border-stone-200'
                      }`}>
                        {rem.icon || '🔔'}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                            {formatRemaining(rem.nextTriggerTime)}
                          </span>
                          {is8AM && (
                            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                              ⏰ Daily 8:00 AM Alarm
                            </span>
                          )}
                          {isPalace && (
                            <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                              {t.tabs.palace}
                            </span>
                          )}
                          {isMed && (
                            <span className="text-xs font-semibold bg-stone-100 text-stone-900 px-2 py-0.5 rounded-md border border-stone-200">
                              {t.dashboard.morningMedicine}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                          {rem.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium leading-snug">
                          {rem.notes || rem.voiceText}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                      {isPalace && onNavigateTab && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateTab('palace');
                          }}
                          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-stone-200"
                        >
                          <span>{t.tabs.palace}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleMarkReminderDone(e, rem)}
                        title={t.actions.done}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isMed ? t.actions.takeMedication : t.actions.done}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeakReminder(rem);
                        }}
                        title={t.actions.testAudio}
                        className={`p-2 rounded-xl transition-colors ${
                          speechActive === rem.id
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                      >
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: Daily Holistic Rituals (Sunlight, Hydration, Movement, Meals, Sandhya) */}
      {(activeFilter === 'all' || activeFilter === 'rituals') && (
        <section className="space-y-4">
          <DailyRituals
            lang={lang}
            onOpenReminderAlert={onOpenReminderAlert}
          />
        </section>
      )}
    </div>
  );
}
