import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { logActivity } from '../../lib/activityStore';

const COLORS = [
  { id: 'green', color: 'bg-emerald-600', active: 'bg-emerald-400', soundFreq: 261.63 },
  { id: 'red', color: 'bg-rose-600', active: 'bg-rose-400', soundFreq: 329.63 },
  { id: 'yellow', color: 'bg-amber-600', active: 'bg-amber-300', soundFreq: 392.00 },
  { id: 'blue', color: 'bg-sky-600', active: 'bg-sky-400', soundFreq: 523.25 },
];

export default function SequenceMemory({ onBack }: { onBack: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const playTone = (freq: number) => {
    if (!audioCtxRef.current) return;
    try {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtxRef.current.currentTime + 0.45);
      setTimeout(() => {
        try {
          osc.stop();
        } catch {
          // ignore
        }
      }, 450);
    } catch {
      // ignore
    }
  };

  const startNewGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setIsGameOver(false);
    nextRound([]);
  };

  const nextRound = (currentSeq: number[]) => {
    const nextColor = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextColor];
    setSequence(newSeq);
    setPlayerSequence([]);
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlayingSequence(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    for (let i = 0; i < seq.length; i++) {
      setActiveColorIndex(seq[i]);
      playTone(COLORS[seq[i]].soundFreq);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColorIndex(null);
      await new Promise(resolve => setTimeout(resolve, 350));
    }
    setIsPlayingSequence(false);
  };

  const handleColorClick = (index: number) => {
    if (isPlayingSequence || isGameOver || sequence.length === 0) return;
    playTone(COLORS[index].soundFreq);
    setActiveColorIndex(index);
    setTimeout(() => setActiveColorIndex(null), 250);

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setIsGameOver(true);
      logActivity('Sequence Memory', score, { sequenceLength: sequence.length });
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      setScore(score + 1);
      setIsPlayingSequence(true);
      setTimeout(() => {
        nextRound(sequence);
      }, 900);
    }
  };

  return (
    <div className="h-full w-full bg-[#faf8f5] flex flex-col p-4 sm:p-6 overflow-hidden relative">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-3 bg-white border border-stone-200 rounded-full shadow-2xs hover:bg-stone-50">
            <ArrowLeft className="w-6 h-6 text-stone-700" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Sequence Memory</h1>
            <p className="text-xs text-stone-500 font-medium">Follow the tone and color pattern</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm sm:text-base font-bold text-stone-900 bg-white border border-stone-200 px-4 py-2 rounded-xl shadow-2xs">
            Score: {score}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {sequence.length === 0 && !isGameOver ? (
          <button 
            onClick={startNewGame} 
            className="w-40 h-40 bg-stone-900 hover:bg-stone-800 text-white rounded-full flex flex-col items-center justify-center gap-2.5 shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="w-12 h-12 ml-1" />
            <span className="text-lg font-bold">Start Game</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-sm w-full aspect-square">
            {COLORS.map((c, index) => (
              <button
                key={c.id}
                onClick={() => handleColorClick(index)}
                disabled={isPlayingSequence || isGameOver}
                className={`rounded-2xl transition-all duration-150 border border-black/10 active:scale-95 ${
                  activeColorIndex === index 
                    ? c.active + ' scale-105 shadow-md' 
                    : c.color + ' opacity-90 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        )}
        
        {isPlayingSequence && sequence.length > 0 && (
          <p className="mt-8 text-base font-bold text-stone-600 animate-pulse">Watch and listen carefully...</p>
        )}
        {!isPlayingSequence && sequence.length > 0 && !isGameOver && (
          <p className="mt-8 text-base font-bold text-stone-900">Your turn! Tap the sequence.</p>
        )}
      </div>

      {isGameOver && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-7 rounded-3xl text-center max-w-sm w-full border border-stone-200 shadow-xl">
            <h2 className="text-2xl font-bold mb-2 text-stone-900">Session Complete</h2>
            <p className="text-sm text-stone-600 mb-6 font-medium">You reached a pattern score of <strong className="text-stone-900">{score}</strong>.</p>
            <div className="space-y-2">
              <button onClick={startNewGame} className="w-full py-3 text-sm font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-2xs transition-colors">
                Try Again
              </button>
              <button onClick={onBack} className="w-full py-3 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
