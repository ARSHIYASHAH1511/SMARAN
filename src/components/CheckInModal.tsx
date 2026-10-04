import { useState } from 'react';
import { Smile, Meh, Frown, BatteryFull, BatteryMedium, BatteryLow, Moon, Sun, Sunrise } from 'lucide-react';

export default function CheckInModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<'happy' | 'okay' | 'sad' | null>(null);
  const [sleep, setSleep] = useState<'good' | 'okay' | 'poor' | null>(null);
  const [energy, setEnergy] = useState<'high' | 'medium' | 'low' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!mood || !sleep || !energy) return;
    setIsSubmitting(true);
    
    const dateString = new Date().toISOString().split('T')[0];
    const checkInData = {
      dateString,
      mood,
      sleep,
      energy,
      createdAt: Date.now()
    };

    // Store locally to prevent showing again today
    localStorage.setItem('smriti_last_checkin', dateString);
    try {
      const existing = JSON.parse(localStorage.getItem('Smaran_checkins') || '[]');
      existing.unshift(checkInData);
      localStorage.setItem('Smaran_checkins', JSON.stringify(existing.slice(0, 30)));
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-xl border border-stone-200">
        <h2 className="text-xl font-bold text-stone-900 text-center">Daily Check-In</h2>
        <p className="text-xs sm:text-sm text-stone-500 text-center mt-1 mb-6">A gentle check on how you are feeling today.</p>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-stone-800 text-center mb-1">How is your mood right now?</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <button 
                onClick={() => setMood('happy')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  mood === 'happy' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Smile className="w-8 h-8 text-stone-700 mb-1.5" />
                <span className="text-sm font-semibold">Peaceful</span>
              </button>
              <button 
                onClick={() => setMood('okay')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  mood === 'okay' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Meh className="w-8 h-8 text-stone-600 mb-1.5" />
                <span className="text-sm font-semibold">Okay</span>
              </button>
              <button 
                onClick={() => setMood('sad')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  mood === 'sad' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Frown className="w-8 h-8 text-stone-600 mb-1.5" />
                <span className="text-sm font-semibold">Low</span>
              </button>
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={!mood}
              className="mt-4 w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-stone-800 text-center mb-1">How was your rest last night?</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <button 
                onClick={() => setSleep('good')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  sleep === 'good' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Sun className="w-8 h-8 text-stone-700 mb-1.5" />
                <span className="text-sm font-semibold">Well Rested</span>
              </button>
              <button 
                onClick={() => setSleep('okay')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  sleep === 'okay' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Sunrise className="w-8 h-8 text-stone-600 mb-1.5" />
                <span className="text-sm font-semibold">Fair</span>
              </button>
              <button 
                onClick={() => setSleep('poor')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  sleep === 'poor' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Moon className="w-8 h-8 text-stone-600 mb-1.5" />
                <span className="text-sm font-semibold">Restless</span>
              </button>
            </div>
            <button 
              onClick={() => setStep(3)} 
              disabled={!sleep}
              className="mt-4 w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-stone-800 text-center mb-1">How is your energy level?</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <button 
                onClick={() => setEnergy('high')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  energy === 'high' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <BatteryFull className="w-8 h-8 text-stone-700 mb-1.5" />
                <span className="text-sm font-semibold">Good</span>
              </button>
              <button 
                onClick={() => setEnergy('medium')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  energy === 'medium' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <BatteryMedium className="w-8 h-8 text-stone-600 mb-1.5" />
                <span className="text-sm font-semibold">Medium</span>
              </button>
              <button 
                onClick={() => setEnergy('low')} 
                className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all ${
                  energy === 'low' ? 'border-stone-800 bg-stone-100 text-stone-900 shadow-2xs' : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <BatteryLow className="w-8 h-8 text-stone-600 mb-1.5" />
                <span className="text-sm font-semibold">Gentle</span>
              </button>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={!energy || isSubmitting}
              className="mt-4 w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-sm font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Complete Check-In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
