/**
 * Firefly AI - High-Contrast Accessible Reminder Alert Modal
 * Designed with senior-friendly large typography, clear action buttons,
 * and immediate navigation to the Memory Palace or medication confirmation.
 */

import { useState, useEffect } from 'react';
import {
  Reminder,
  playChimeSound,
  speakReminderText,
  reminderEngine,
  getLocalizedReminderContent,
  unlockAudio,
} from '../lib/reminderEngine';
import { Volume2, CheckCircle2, Clock, X, ArrowRight, BellRing } from 'lucide-react';
import { Language } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';

interface ReminderModalProps {
  reminder: Reminder;
  lang?: Language;
  onClose: () => void;
  onNavigateTab?: (tab: 'home' | 'rituals' | 'palace' | 'album' | 'therapist' | 'motif_match' | 'sequence_memory') => void;
}

export default function ReminderModal({
  reminder,
  lang: propLang,
  onClose,
  onNavigateTab,
}: ReminderModalProps) {
  const { lang: contextLang, t } = useLanguage();
  const lang = propLang || contextLang || 'en';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const localized = getLocalizedReminderContent(reminder, lang);

  const handleSpeak = () => {
    unlockAudio();
    setIsSpeaking(true);
    playChimeSound();
    speakReminderText(localized.voiceText, lang);
    setTimeout(() => setIsSpeaking(false), 4500);
  };

  useEffect(() => {
    if (reminder.voiceAlert) {
      const timer = setTimeout(() => {
        handleSpeak();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [reminder.id, lang]);

  const handleMarkDone = async () => {
    setIsCompleted(true);
    await reminderEngine.markReminderCompleted(reminder.id);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSnooze = () => {
    reminderEngine.snoozeReminder(reminder.id, 15);
    onClose();
  };

  const handleGoToTarget = () => {
    if (reminder.targetTab && onNavigateTab) {
      onNavigateTab(reminder.targetTab);
    }
    onClose();
  };

  const is8AM = reminder.id === 'rem-daily-8am-open' || reminder.scheduledTime === '08:00';

  const getCategoryTag = () => {
    if (is8AM) {
      return '8:00 AM Morning Alarm';
    }
    switch (reminder.category) {
      case 'medication':
        return 'Medication Schedule';
      case 'palace':
        return 'Memory Palace';
      case 'hydration':
        return 'Hydration & Tea';
      case 'activity':
        return 'Activity';
      case 'prayer':
        return 'Peace & Evening';
      default:
        return 'Daily Activity';
    }
  };

  const tag = getCategoryTag();

  return (
    <div
      id="reminder-alert-modal"
      className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-2xs"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl border border-stone-200 relative flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors z-10"
          aria-label="Dismiss alert"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-stone-50 p-5 border-b border-stone-200 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white shadow-2xs flex items-center justify-center text-2xl border border-stone-200 shrink-0">
            {reminder.icon || '🔔'}
          </div>
          <div className="pr-6">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border border-stone-200 bg-stone-100 text-stone-700 inline-flex items-center gap-1">
              <BellRing className="w-3 h-3 text-stone-600" />
              {tag}
            </span>
            <h2 className="text-lg font-bold text-stone-900 mt-1 leading-snug">
              {localized.title}
            </h2>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {isCompleted ? (
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-stone-800 mx-auto" />
              <h3 className="text-lg font-bold text-stone-900">Marked as Completed</h3>
              <p className="text-stone-600 font-medium text-xs sm:text-sm">
                Saved to your daily health & memory record.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <p className="text-sm sm:text-base text-stone-800 font-medium leading-relaxed">
                  {localized.notes || localized.voiceText}
                </p>
                {reminder.intervalType === 'interval' && (
                  <p className="text-xs text-stone-500 mt-2.5 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    Repeating every {reminder.intervalMinutes || 90} minutes
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                {is8AM && onNavigateTab && (
                  <button
                    id="btn-alert-open-morning-care"
                    onClick={() => {
                      onNavigateTab('rituals');
                      onClose();
                    }}
                    className="w-full py-3.5 px-4 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
                  >
                    <span>🌅 Open Morning Care & Daily Tasks</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {reminder.category === 'palace' && !is8AM && (
                  <button
                    id="btn-alert-open-palace"
                    onClick={handleGoToTarget}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 transition-colors shadow-2xs"
                  >
                    <span>Open 3D Memory Palace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  id="btn-alert-mark-done"
                  onClick={handleMarkDone}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white shadow-2xs transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {is8AM ? "I'm Awake - Stop 8:00 AM Alarm" : reminder.category === 'medication' ? (t.actions?.takeMedication || 'I Have Taken My Medicine') : (t.actions?.done || 'Mark as Done')}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id="btn-alert-speak"
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    className="py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-stone-600" />
                    <span>{isSpeaking ? 'Speaking...' : (t.actions?.speakVoice || 'Listen Voice')}</span>
                  </button>
                  <button
                    id="btn-alert-snooze"
                    onClick={handleSnooze}
                    className="py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-stone-600" />
                    <span>{t.actions?.snooze || 'Snooze (15m)'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
