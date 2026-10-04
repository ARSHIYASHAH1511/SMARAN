import { useState, useEffect } from 'react';
import {
  Heart,
  Brain,
  Clock,
  Phone,
  Volume2,
  HelpCircle,
  Wifi,
  WifiOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import MotifMatch from './games/MotifMatch';
import MemoryCards from './games/MemoryCards';
import SequenceMemory from './games/SequenceMemory';
import ReminderManagerModal from './ReminderManagerModal';
import { Language, TRANSLATIONS } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Reminder,
  reminderEngine,
  playChimeSound,
  speakReminderText,
  getLocalizedReminderContent,
  unlockAudio,
} from '../lib/reminderEngine';

interface DashboardProps {
  lang?: Language;
  onOpenTutorial?: () => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  onNavigateTab?: (tab: 'home' | 'rituals' | 'palace' | 'album' | 'therapist' | 'motif_match' | 'sequence_memory') => void;
  onOpenReminderAlert?: (reminder: Reminder) => void;
}

export default function Dashboard({
  lang: propLang,
  onOpenTutorial,
  isOffline = false,
  onToggleOffline,
  onNavigateTab,
  onOpenReminderAlert,
}: DashboardProps) {
  const { lang: contextLang, t: contextT } = useLanguage();
  const lang = propLang || contextLang || 'en';
  const t = TRANSLATIONS[lang] || contextT;

  const [activeGame, setActiveGame] = useState<'motif' | 'cards' | 'sequence' | null>(null);
  const [callingDaughter, setCallingDaughter] = useState(false);
  const [speechActive, setSpeechActive] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    const unsub = reminderEngine.subscribe((updatedList) => {
      setReminders(updatedList);
    });
    return () => unsub();
  }, []);

  const handleSpeakReminder = (rem: Reminder) => {
    unlockAudio();
    playChimeSound();
    const localized = getLocalizedReminderContent(rem, lang);
    setSpeechActive(rem.id);
    speakReminderText(localized.voiceText, lang);
    setTimeout(() => setSpeechActive(null), 4000);
  };

  const handleMarkDone = async (e: React.MouseEvent, rem: Reminder) => {
    e.stopPropagation();
    playChimeSound();
    await reminderEngine.markReminderCompleted(rem.id);
    reminderEngine.snoozeReminder(rem.id, rem.intervalMinutes);
  };

  const handleOpenPalace = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigateTab) {
      onNavigateTab('palace');
    }
  };

  const formatRemaining = (nextTime: number) => {
    const diff = nextTime - Date.now();
    if (diff <= 0) return 'Due now';
    const minutes = Math.floor(diff / (60 * 1000));
    if (minutes < 60) return `in ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remM = minutes % 60;
    return `in ${hours}h ${remM}m`;
  };

  if (activeGame === 'motif') {
    return <MotifMatch onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'cards') {
    return <MemoryCards onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === 'sequence') {
    return <SequenceMemory onBack={() => setActiveGame(null)} />;
  }

  const alarm8AM = reminders.find(
    (r) => r.id === 'rem-daily-8am-open' || (r.intervalType === 'specific_time' && r.scheduledTime === '08:00')
  );
  const otherActiveReminders = reminders.filter(
    (r) => r.enabled && r.id !== 'rem-daily-8am-open' && r.scheduledTime !== '08:00'
  );
  const nextReminder = otherActiveReminders[0] || (alarm8AM?.enabled ? alarm8AM : null);

  return (
    <div className="pb-28 bg-[#faf8f5] min-h-screen">
      <header className="bg-white border-b border-stone-200/80 px-6 py-6 sm:px-8 sm:py-7 shadow-2xs">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🪔</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-base sm:text-lg text-stone-600 mt-1 font-medium">
              {t.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleOffline}
              title="Toggle Offline Simulation"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                isOffline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.offlineMode}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.onlineMode}</span>
                </>
              )}
            </button>

            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 flex items-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
                <span>{t.quickTour}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-5 sm:p-8 space-y-8">
        {isOffline && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5 text-emerald-950">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-emerald-950">{t.offlineBannerTitle}</h3>
              <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                {t.offlineBannerDesc}
              </p>
            </div>
          </div>
        )}

        {/* Daily 8:00 AM Morning Sanctuary Alarm Hero Card */}
        <section className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-stone-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-xs shrink-0">
                ⏰
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-amber-700 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                    Daily 8:00 AM Alarm
                  </span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {alarm8AM && alarm8AM.enabled ? 'Scheduled Every Day' : 'Paused'}
                  </span>
                  {alarm8AM && (
                    <span className="text-xs font-semibold text-stone-600">
                      Next alarm: {formatRemaining(alarm8AM.nextTriggerTime)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1.5 tracking-tight">
                  Morning Sanctuary Alarm (8:00 AM)
                </h2>
                <p className="text-sm sm:text-base text-stone-700 mt-1 font-medium max-w-2xl leading-relaxed">
                  FireFly AI sounds a gentle morning chime and spoken reminder every morning at 8:00 AM to prompt you to open the application, take morning medicines, and check your 3D Memory Palace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
              <button
                onClick={() => {
                  unlockAudio();
                  const targetRem = alarm8AM || reminderEngine.getReminders().find((r) => r.id === 'rem-daily-8am-open');
                  if (targetRem) {
                    reminderEngine.triggerReminder(targetRem, true);
                    if (onOpenReminderAlert) {
                      onOpenReminderAlert(targetRem);
                    }
                  }
                }}
                className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                title="Test the 8:00 AM alarm melody, voice announcement, and alert modal"
              >
                <Volume2 className="w-4 h-4" />
                <span>Test 8:00 AM Alarm</span>
              </button>

              {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
                <button
                  onClick={async () => {
                    const perm = await reminderEngine.requestNotificationPermission();
                    if (perm === 'granted') {
                      playChimeSound();
                    }
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Enable Notifications</span>
                </button>
              )}

              <button
                onClick={() => setShowManager(true)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-xs sm:text-sm border border-stone-200 transition-colors cursor-pointer"
              >
                Configure
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-stone-900">
              <Clock className="w-6 h-6 text-amber-700" />
              <span>{t.reminders}</span>
            </h2>
            <button
              onClick={() => onNavigateTab && onNavigateTab('rituals')}
              className="text-amber-800 hover:text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {nextReminder ? (
            <div
              className="bg-white border border-stone-200 hover:border-stone-300 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-3xl shrink-0">
                  {nextReminder.icon || '🔔'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                      Next: {formatRemaining(nextReminder.nextTriggerTime)}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      Every {nextReminder.intervalMinutes}m
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                    {getLocalizedReminderContent(nextReminder, lang).title}
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 mt-1 font-medium">
                    {getLocalizedReminderContent(nextReminder, lang).notes || getLocalizedReminderContent(nextReminder, lang).voiceText}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end md:self-center">
                {nextReminder.category === 'palace' && (
                  <button
                    onClick={handleOpenPalace}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <span>Go to Palace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => handleMarkDone(e, nextReminder)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{nextReminder.category === 'medication' ? 'Mark Taken' : 'Mark Done'}</span>
                </button>
                <button
                  onClick={() => handleSpeakReminder(nextReminder)}
                  title="Listen to spoken instructions"
                  className={`p-2.5 rounded-xl border transition-colors ${
                    speechActive === nextReminder.id
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 text-center text-stone-600 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-base text-stone-800">All current reminders are up to date.</p>
              <p className="text-xs sm:text-sm">You are doing wonderfully today. Take a moment to relax or try a gentle puzzle.</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-stone-900">
              <Brain className="w-6 h-6 text-emerald-700" />
              <span>{t.cognitiveGames}</span>
            </h2>
            <span className="text-xs font-semibold text-stone-600">
              North East Heritage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveGame('motif')}
              className="bg-white hover:bg-stone-50 active:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-3xl p-6 text-left transition-all shadow-xs flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl mb-3 block">🦏</span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {t.matchMotifs}
                </h3>
                <p className="text-sm text-stone-600 font-medium mt-1.5 leading-relaxed">
                  {t.matchMotifsDesc}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-bold text-amber-800">
                <span>Play Game</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setActiveGame('cards')}
              className="bg-white hover:bg-stone-50 active:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-3xl p-6 text-left transition-all shadow-xs flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl mb-3 block">🧣</span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {t.memoryCards}
                </h3>
                <p className="text-sm text-stone-600 font-medium mt-1.5 leading-relaxed">
                  {t.memoryCardsDesc}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-bold text-amber-800">
                <span>Play Game</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setActiveGame('sequence')}
              className="bg-white hover:bg-stone-50 active:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-3xl p-6 text-left transition-all shadow-xs flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl mb-3 block">🥁</span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {t.sequenceMemory}
                </h3>
                <p className="text-sm text-stone-600 font-medium mt-1.5 leading-relaxed">
                  {t.sequenceMemoryDesc}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-bold text-amber-800">
                <span>Play Game</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2.5 text-stone-900">
            <Heart className="w-6 h-6 text-rose-700" />
            <span>{t.familySupport}</span>
          </h2>

          <button
            onClick={() => setCallingDaughter(true)}
            className="w-full bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-3xl p-6 sm:p-7 flex items-center justify-between gap-5 transition-all shadow-xs text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-rose-900 transition-colors">
                  {t.callFamily}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium mt-0.5">
                  {t.callFamilySub}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-rose-800 font-bold text-sm bg-rose-50 px-4 py-2 rounded-xl">
              <span>Start Call</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </section>
      </main>

      {callingDaughter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center border border-stone-200 shadow-xl">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Phone className="w-9 h-9 text-rose-700" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900">Calling Anjali...</h3>
            <p className="text-sm text-stone-600 font-medium mt-2 leading-relaxed">
              "Namaskar Deuta! I am right here. How are you feeling today?"
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setCallingDaughter(false)}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-base transition-colors"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      <ReminderManagerModal
        isOpen={showManager}
        onClose={() => setShowManager(false)}
        lang={lang}
        onTriggerTest={(testRem) => {
          if (onOpenReminderAlert) {
            onOpenReminderAlert(testRem);
          }
        }}
      />
    </div>
  );
}
