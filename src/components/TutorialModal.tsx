import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Home, Box, BookImage, HeartHandshake, Mic, Key, ShieldAlert } from 'lucide-react';
import { TRANSLATIONS, Language } from '../lib/translations';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigateTab?: (tab: 'home' | 'palace' | 'album' | 'therapist') => void;
}

export default function TutorialModal({ isOpen, onClose, lang }: TutorialModalProps) {
  const [step, setStep] = useState(0);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const steps = [
    {
      title: t.tutorial.step1Title,
      desc: t.tutorial.step1Desc,
      icon: <Home className="w-14 h-14 text-stone-700" />,
      tag: 'Daily Health & Calm Routine',
      color: 'border-stone-200 bg-stone-50',
      actionTab: 'home' as const,
      highlight: 'Morning medicine reminder with Tulsi tea & Bihu rhythm games.'
    },
    {
      title: t.tutorial.step2Title,
      desc: t.tutorial.step2Desc,
      icon: (
        <div className="relative">
          <Box className="w-14 h-14 text-stone-700" />
          <Key className="w-6 h-6 text-stone-900 absolute -bottom-1 -right-1" />
        </div>
      ),
      tag: 'Safe 3D Memory Palace',
      color: 'border-stone-200 bg-stone-50',
      actionTab: 'palace' as const,
      highlight: "Brass keys on Gamosa, BP medicine box, and Assam tea thermos."
    },
    {
      title: t.tutorial.step3Title,
      desc: t.tutorial.step3Desc,
      icon: <BookImage className="w-14 h-14 text-stone-700" />,
      tag: 'Cherished Memories',
      color: 'border-stone-200 bg-stone-50',
      actionTab: 'album' as const,
      highlight: 'Photos of Majuli Satra, Kaziranga, and family moments.'
    },
    {
      title: t.tutorial.step4Title,
      desc: t.tutorial.step4Desc,
      icon: <HeartHandshake className="w-14 h-14 text-stone-700" />,
      tag: 'Empathetic AI Companion',
      color: 'border-stone-200 bg-stone-50',
      actionTab: 'therapist' as const,
      highlight: 'Talks with you, validates memories, and pulls up matching family photos.'
    },
    {
      title: t.tutorial.step5Title,
      desc: t.tutorial.step5Desc,
      icon: (
        <div className="relative">
          <Mic className="w-14 h-14 text-stone-700" />
          <ShieldAlert className="w-6 h-6 text-stone-900 absolute -top-1 -right-1" />
        </div>
      ),
      tag: 'Voice AI & Doctor Analytics',
      color: 'border-stone-200 bg-stone-50',
      highlight: 'Just tap the mic to speak commands. Caregivers can view weekly cognitive charts in Settings.'
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 sm:p-6 animate-gentle-in">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-600 transition-colors"
          aria-label="Close tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-600" />
              {t.tutorial.title}
            </span>
            <span className="text-xs font-bold text-stone-400">
              {step + 1} / {steps.length}
            </span>
          </div>
          <p className="text-sm sm:text-base text-stone-600 font-medium mb-3">
            {t.tutorial.welcome}
          </p>
        </div>

        <div className={`border rounded-2xl p-5 my-2 text-center flex flex-col items-center justify-center ${current.color}`}>
          <div className="mb-3 p-3 bg-white rounded-2xl shadow-2xs border border-stone-200">
            {current.icon}
          </div>
          <span className="inline-block px-2.5 py-0.5 bg-white text-stone-700 font-bold text-[10px] uppercase tracking-wider rounded-md mb-2 border border-stone-200">
            {current.tag}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2 text-balance">
            {current.title}
          </h3>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
            {current.desc}
          </p>
          {current.highlight && (
            <div className="mt-3 p-2.5 bg-white rounded-xl text-xs sm:text-sm font-semibold text-stone-800 border border-stone-200">
                {current.highlight}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 my-3">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-stone-900' : 'w-2 bg-stone-200'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
              step === 0
                ? 'opacity-30 cursor-not-allowed text-stone-400'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.tutorial.prev}</span>
          </button>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 text-xs sm:text-sm font-medium underline px-2 py-1"
          >
            {t.tutorial.close}
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <span>{step === steps.length - 1 ? t.tutorial.finish : t.tutorial.next}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
