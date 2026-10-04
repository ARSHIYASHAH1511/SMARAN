/**
 * FireFly AI - Daily Rituals Dashboard Component
 * Tracks non-game daily activities (Sunlight exposure, Hydration, Movement, Meals, Nature touch, Evening calm)
 * to provide a comprehensive, holistic view of daily dementia wellness.
 */

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  DailyRitualItem,
  DailyRitualDay,
  dailyRitualsEngine,
} from '../lib/dailyRitualsEngine';
import { Language } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sun,
  Droplets,
  Footprints,
  Utensils,
  Leaf,
  Flame,
  CheckCircle2,
  Volume2,
  Plus,
  Trash2,
  Info,
  Timer,
  Clock,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  FileEdit,
} from 'lucide-react';
import { playChimeSound } from '../lib/reminderEngine';

interface DailyRitualsProps {
  lang?: Language;
  onOpenReminderAlert?: (rem: any) => void;
  className?: string;
}

export default function DailyRituals({
  lang: propLang,
  className = '',
}: DailyRitualsProps) {
  const { lang: contextLang } = useLanguage();
  const lang = propLang || contextLang || 'en';
  const [dayData, setDayData] = useState<DailyRitualDay>(dailyRitualsEngine.getTodayData());
  const [speakingRitualId, setSpeakingRitualId] = useState<string | null>(null);
  const [showClinicalInfo, setShowClinicalInfo] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [showCaregiverNoteInput, setShowCaregiverNoteInput] = useState(false);
  const [caregiverNoteText, setCaregiverNoteText] = useState('');
  const [history, setHistory] = useState<ReturnType<typeof dailyRitualsEngine.getWeeklyHistory>>([]);

  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
  const [celebrationBanner, setCelebrationBanner] = useState<{ title: string; category: string } | null>(null);

  const [sunTimerOpen, setSunTimerOpen] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DailyRitualItem['category']>('custom');
  const [newIcon, setNewIcon] = useState('✨');
  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    dailyRitualsEngine.init();
    const unsub = dailyRitualsEngine.subscribe((data) => {
      setDayData(data);
      if (data.caregiverNote !== undefined) {
        setCaregiverNoteText(data.caregiverNote);
      }
      setHistory(dailyRitualsEngine.getWeeklyHistory());
    });
    return () => unsub();
  }, []);

  const triggerCelebration = (e?: React.MouseEvent | HTMLElement | null) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([45, 30, 60]);
      } catch {
        // Safe fallback
      }
    }

    try {
      playChimeSound();
    } catch {
      // Safe fallback
    }

    try {
      let origin = { x: 0.5, y: 0.55 };
      if (e && 'clientX' in e && e.clientX && e.clientY) {
        origin = {
          x: Math.max(0.15, Math.min(0.85, e.clientX / window.innerWidth)),
          y: Math.max(0.15, Math.min(0.85, e.clientY / window.innerHeight)),
        };
      }
      confetti({
        particleCount: 45,
        spread: 70,
        origin,
        colors: ['#F59E0B', '#10B981', '#0EA5E9', '#F43F5E', '#8B5CF6', '#FBBF24'],
        ticks: 200,
        gravity: 0.9,
        scalar: 1.15,
        disableForReducedMotion: true,
      });

      setTimeout(() => {
        try {
          confetti({
            particleCount: 22,
            angle: 60,
            spread: 55,
            origin: { x: Math.max(0.1, origin.x - 0.1), y: origin.y },
            colors: ['#F59E0B', '#10B981', '#FBBF24'],
          });
          confetti({
            particleCount: 22,
            angle: 120,
            spread: 55,
            origin: { x: Math.min(0.9, origin.x + 0.1), y: origin.y },
            colors: ['#0EA5E9', '#8B5CF6', '#F43F5E'],
          });
        } catch {
          // ignore
        }
      }, 140);
    } catch (err) {
      console.warn('Confetti effect fallback:', err);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      const sunlightItem = dayData.rituals.find((r) => r.key === 'sunlight');
      if (sunlightItem && !sunlightItem.completed) {
        dailyRitualsEngine.toggleRitual(sunlightItem.id, 15);
        setJustCompletedId(sunlightItem.id);
        setCelebrationBanner({ title: sunlightItem.title, category: '15-min Gentle Sunlight Complete' });
        triggerCelebration();
        setTimeout(() => {
          setJustCompletedId((curr) => (curr === sunlightItem.id ? null : curr));
        }, 1200);
        setTimeout(() => {
          setCelebrationBanner((curr) => (curr?.title === sunlightItem.title ? null : curr));
        }, 3800);
      } else {
        playChimeSound();
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, dayData.rituals]);

  const handleToggle = (ritualId: string, e?: React.MouseEvent) => {
    const item = dayData.rituals.find((r) => r.id === ritualId);
    const willBeCompleted = item ? !item.completed : false;
    dailyRitualsEngine.toggleRitual(ritualId);
    if (willBeCompleted && item) {
      setJustCompletedId(ritualId);
      setCelebrationBanner({ title: item.title, category: item.category });
      triggerCelebration(e);
      setTimeout(() => {
        setJustCompletedId((curr) => (curr === ritualId ? null : curr));
      }, 1200);
      setTimeout(() => {
        setCelebrationBanner((curr) => (curr?.title === item.title ? null : curr));
      }, 3800);
    }
  };

  const handleWaterDelta = (delta: number, e?: React.MouseEvent) => {
    const waterItem = dayData.rituals.find((r) => r.key === 'water');
    const wasCompleted = waterItem?.completed;
    const nextVal = Math.max(0, (waterItem?.currentValue || 0) + delta);
    const willBeCompleted = waterItem ? nextVal >= waterItem.targetValue : false;

    if (delta > 0 && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        // ignore
      }
    }
    dailyRitualsEngine.incrementHydration(delta);
    if (willBeCompleted && !wasCompleted && waterItem) {
      setJustCompletedId(waterItem.id);
      setCelebrationBanner({ title: waterItem.title, category: 'Daily Hydration Target Reached!' });
      triggerCelebration(e);
      setTimeout(() => {
        setJustCompletedId((curr) => (curr === waterItem.id ? null : curr));
      }, 1200);
      setTimeout(() => {
        setCelebrationBanner((curr) => (curr?.title === waterItem.title ? null : curr));
      }, 3800);
    }
  };

  const handleMealSubToggle = (mealSubId: string, e?: React.MouseEvent) => {
    const mealItem = dayData.rituals.find((r) => r.key === 'meals');
    const wasCompleted = mealItem?.completed;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        // ignore
      }
    }
    dailyRitualsEngine.toggleMealSubItem(mealSubId);
    if (mealItem && mealItem.subItems) {
      const updatedCount = mealItem.subItems.filter(
        (s) => (s.id === mealSubId ? !s.completed : s.completed)
      ).length;
      if (updatedCount === mealItem.subItems.length && !wasCompleted) {
        setJustCompletedId(mealItem.id);
        setCelebrationBanner({ title: mealItem.title, category: 'All 3 Daily Meals Nourished' });
        triggerCelebration(e);
        setTimeout(() => {
          setJustCompletedId((curr) => (curr === mealItem.id ? null : curr));
        }, 1200);
        setTimeout(() => {
          setCelebrationBanner((curr) => (curr?.title === mealItem.title ? null : curr));
        }, 3800);
      }
    }
  };

  const handleSpeak = (ritual: DailyRitualItem) => {
    setSpeakingRitualId(ritual.id);
    dailyRitualsEngine.speakRitualPrompt(ritual, lang);
    setTimeout(() => setSpeakingRitualId(null), 4500);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    dailyRitualsEngine.addCustomRitual(
      newTitle,
      newCategory,
      newIcon,
      1,
      'times',
      newBenefit.trim() || 'Custom daily wellness routine for elder comfort.'
    );
    setNewTitle('');
    setNewBenefit('');
    setShowAddCustom(false);
  };

  const handleDeleteRitual = (id: string) => {
    dailyRitualsEngine.deleteRitual(id);
  };

  const handleSaveCaregiverNote = () => {
    dailyRitualsEngine.setCaregiverNote(caregiverNoteText);
    setShowCaregiverNoteInput(false);
  };

  const completedCount = dayData.rituals.filter((r) => r.completed).length;
  const totalCount = dayData.rituals.length;

  const getRitualStyles = (item: DailyRitualItem) => {
    const baseBorder = item.completed
      ? 'border-emerald-300 bg-emerald-50/40'
      : 'border-stone-200 bg-white hover:border-stone-300';
    const baseBadge = item.completed
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-stone-100 text-stone-700 border-stone-200';

    switch (item.key) {
      case 'sunlight':
        return {
          border: baseBorder,
          badge: baseBadge,
          activeRing: 'ring-amber-200',
          iconColor: 'text-amber-700',
          IconComponent: Sun,
        };
      case 'water':
        return {
          border: baseBorder,
          badge: baseBadge,
          activeRing: 'ring-sky-200',
          iconColor: 'text-sky-700',
          IconComponent: Droplets,
        };
      case 'walk':
        return {
          border: baseBorder,
          badge: baseBadge,
          activeRing: 'ring-emerald-200',
          iconColor: 'text-emerald-700',
          IconComponent: Footprints,
        };
      case 'meals':
        return {
          border: baseBorder,
          badge: baseBadge,
          activeRing: 'ring-amber-200',
          iconColor: 'text-amber-800',
          IconComponent: Utensils,
        };
      case 'nature':
        return {
          border: baseBorder,
          badge: baseBadge,
          activeRing: 'ring-stone-200',
          iconColor: 'text-emerald-800',
          IconComponent: Leaf,
        };
      case 'sandhya':
        return {
          border: baseBorder,
          badge: baseBadge,
          activeRing: 'ring-amber-200',
          iconColor: 'text-amber-800',
          IconComponent: Flame,
        };
      default:
        return {
          border: baseBorder,
          badge: baseBadge,
          activeRing: 'ring-stone-200',
          iconColor: 'text-stone-700',
          IconComponent: Sparkles,
        };
    }
  };

  const formatTimerMinSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section
      id="daily-rituals-section"
      className={`rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6 ${className}`}
      aria-label="Daily Rituals for Holistic Dementia Wellness"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center text-2xl border border-stone-200">
              ☀️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Daily Holistic Rituals
                </h2>
                <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                  Circadian Care
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                Physical, circadian, and sensory anchors beyond games to nourish calm, hydration, and sleep.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 bg-stone-50 p-3 sm:p-4 rounded-2xl border border-stone-200 shrink-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-700 transition-all duration-500 ease-out"
                strokeDasharray={`${dayData.overallPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-base sm:text-lg font-extrabold text-stone-900 leading-none">
                {dayData.overallPercentage}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Today's Rituals
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900">
              {completedCount} of {totalCount} Completed
            </div>
            <div className="text-xs text-stone-600 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-stone-500" />
              {dayData.overallPercentage >= 80
                ? 'Excellent Routine Anchor'
                : dayData.overallPercentage >= 50
                ? 'Steady Daily Routine'
                : 'Gentle Morning Start'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 sm:p-4">
        <button
          onClick={() => setShowClinicalInfo(!showClinicalInfo)}
          className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-stone-800 hover:text-stone-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-600 shrink-0" />
            <span>Why Non-Game Rituals are Crucial for Dementia & Sundowning Care</span>
          </span>
          {showClinicalInfo ? <ChevronUp className="w-4 h-4 text-stone-600" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
        </button>
        {showClinicalInfo && (
          <div className="mt-3 pt-3 border-t border-stone-200 text-xs sm:text-sm text-stone-600 space-y-2 leading-relaxed">
            <p>
              <strong>Circadian Entrainment:</strong> Morning sunlight stimulates ocular retinal ganglion cells, synchronizing melatonin production. This directly mitigates late-afternoon <em>sundowning syndrome</em> (restlessness, anxiety, and confusion at dusk).
            </p>
            <p>
              <strong>Hydration Defense:</strong> Elderly patients frequently lose physiological thirst perception. Even mild dehydration can trigger acute delirium or confusion.
            </p>
            <p>
              <strong>Sensory Grounding:</strong> Tactile plant touch and predictable dusk Sandhya lighting reduce cognitive overload by providing soothing, nostalgic routine markers.
            </p>
          </div>
        )}
      </div>

      {celebrationBanner && (
        <div className="bg-stone-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md flex items-center justify-between border border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl">🎉</span>
            <div>
              <p className="font-bold text-sm sm:text-base leading-tight">
                {celebrationBanner.title} checked off for today
              </p>
              <p className="text-xs text-stone-300 font-medium mt-0.5">
                {celebrationBanner.category} • Gentle daily routine recorded.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCelebrationBanner(null)}
            className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors text-sm"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dayData.rituals.map((item) => {
          const style = getRitualStyles(item);
          const isSunlight = item.key === 'sunlight';
          const isWater = item.key === 'water';
          const isMeals = item.key === 'meals';
          const isJustCompleted = justCompletedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between relative overflow-hidden ${
                style.border
              } ${
                isJustCompleted
                  ? 'ring-2 ring-emerald-500/80 shadow-md bg-emerald-50/50'
                  : ''
              }`}
            >
              {isJustCompleted && (
                <div className="absolute top-2.5 right-2.5 bg-emerald-800 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 z-20">
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  <span>Done</span>
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-xl shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border ${style.badge}`}>
                          {item.category}
                        </span>
                        {item.completed && (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 mt-1 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(item)}
                    title="Listen to gentle voice prompt"
                    className={`p-2 rounded-xl border transition-colors shrink-0 ${
                      speakingRitualId === item.id
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-2.5 leading-snug">
                  {item.clinicalBenefit}
                </p>

                {isSunlight && (
                  <div className="mt-3.5 pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                    <button
                      id="btn-sun-timer-open"
                      onClick={() => setSunTimerOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-stone-200"
                    >
                      <Timer className="w-3.5 h-3.5 text-stone-600" />
                      <span>15-min Sun Timer</span>
                    </button>
                    <span className="text-xs font-medium text-stone-500">
                      Target: 15 mins daily
                    </span>
                  </div>
                )}

                {isWater && (
                  <div className="mt-3.5 pt-3 border-t border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700">
                        Glasses Logged: {item.currentValue} / {item.targetValue} cups
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleWaterDelta(-1, e)}
                          disabled={item.currentValue <= 0}
                          className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 font-bold text-xs flex items-center justify-center transition-colors"
                          title="Remove a cup"
                        >
                          -
                        </button>
                        <button
                          onClick={(e) => handleWaterDelta(1, e)}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                          title="Log 1 cup of warm water or ginger tea"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+1 Cup</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      {Array.from({ length: item.targetValue }).map((_, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => handleWaterDelta(idx < item.currentValue ? -1 : 1, e)}
                          className={`flex-1 h-7 rounded-lg border flex items-center justify-center text-xs cursor-pointer transition-all ${
                            idx < item.currentValue
                              ? 'bg-sky-600 border-sky-700 text-white shadow-2xs'
                              : 'bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100'
                          }`}
                          title={`Cup ${idx + 1}`}
                        >
                          ☕
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isMeals && item.subItems && (
                  <div className="mt-3.5 pt-3 border-t border-stone-200 space-y-1.5">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={(e) => handleMealSubToggle(sub.id, e)}
                        className={`w-full p-2 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                          sub.completed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{sub.label}</span>
                        {sub.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isMeals && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-500 font-medium">
                    {item.completed
                      ? `Completed at ${item.completedAt ? new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'today'}`
                      : 'Pending completion'}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.category === 'custom' && (
                      <button
                        onClick={() => handleDeleteRitual(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Delete custom ritual"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleToggle(item.id, e)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                        item.completed
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{item.completed ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-600" />
              <span>7-Day Routine Consistency</span>
            </h4>
            <span className="text-xs font-medium text-stone-500">
              Circadian Stability
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {history.map((day) => (
              <div
                key={day.dateKey}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                  day.isToday
                    ? 'border-stone-400 bg-stone-50 shadow-2xs'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <span className="text-[11px] font-semibold text-stone-600">{day.label}</span>
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold my-1 ${
                    day.percentage >= 80
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : day.percentage >= 40
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : day.percentage > 0
                      ? 'bg-stone-100 text-stone-900 border border-stone-300'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  {day.percentage}%
                </div>
                <span className="text-[10px] text-stone-500 font-medium">
                  {day.percentage >= 80 ? 'Full' : day.percentage > 0 ? 'Partial' : 'Rest'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2.5 italic">
            Consistency observation: Days with ≥60% ritual completion show reduced dusk disorientation.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-stone-600" />
                <span>Caregiver Observation</span>
              </h4>
              <button
                onClick={() => setShowCaregiverNoteInput(!showCaregiverNoteInput)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900"
              >
                {showCaregiverNoteInput ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {showCaregiverNoteInput ? (
              <div className="mt-2 space-y-2">
                <textarea
                  rows={3}
                  value={caregiverNoteText}
                  onChange={(e) => setCaregiverNoteText(e.target.value)}
                  placeholder="e.g., Sat 20 mins in morning courtyard sun with tulsi tea. Mood calm; zero late-afternoon wandering."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:border-stone-400 focus:outline-none"
                />
                <button
                  onClick={handleSaveCaregiverNote}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                >
                  Save Observation
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-stone-600 mt-2 italic bg-stone-50 p-3 rounded-xl border border-stone-200 min-h-[60px]">
                {dayData.caregiverNote || 'No notes logged yet today. Click "Edit" to record mood or sunlight response.'}
              </p>
            )}
          </div>

          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="w-full py-2 px-3 border border-dashed border-stone-300 hover:border-stone-400 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center justify-center gap-1.5 transition-colors bg-stone-50/50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Daily Care Ritual</span>
          </button>
        </div>
      </div>

      {showAddCustom && (
        <form
          onSubmit={handleAddCustom}
          className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stone-600" />
              <span>Add Custom Senior Care Ritual</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ritual Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Foot massage with warm mustard oil, Leg stretches"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-stone-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Icon Emoji
              </label>
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white text-center font-bold"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Purpose / Benefit Note
            </label>
            <input
              type="text"
              placeholder="e.g. Relieves evening leg restlessness and soothes muscles before sleep."
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-stone-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-2xs"
            >
              Save Ritual
            </button>
          </div>
        </form>
      )}

      {sunTimerOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-3xl border border-stone-200">
              ☀️
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                Morning Circadian Alignment
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
                Courtyard Sun Exposure
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                Sit peacefully in the verandah or courtyard sunlight. Take deep breaths of fresh air.
              </p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <div className="text-5xl font-mono font-bold text-stone-900 tracking-wider">
                {formatTimerMinSec(timerSecondsLeft)}
              </div>
              <div className="text-xs font-medium text-stone-600 mt-2">
                {timerSecondsLeft === 0
                  ? '15 minutes completed. Biological clock aligned.'
                  : isTimerRunning
                  ? 'Sunlight timer active • Enjoy the natural light'
                  : 'Timer paused'}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-colors ${
                  isTimerRunning
                    ? 'bg-stone-800 hover:bg-stone-900 text-white'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Start Sun Timer
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSecondsLeft(15 * 60);
                }}
                className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setSunTimerOpen(false)}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
