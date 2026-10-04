import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { logActivity } from '../../lib/activityStore';

interface CulturalMotif {
  icon: string;
  name: string;
  region: string;
  fact: string;
}

const MOTIF_INFO: Record<string, CulturalMotif> = {
  '🦏': { icon: '🦏', name: 'Kaziranga One-Horned Rhino', region: 'Assam', fact: 'The noble state animal residing peacefully in Kaziranga National Park.' },
  '🧣': { icon: '🧣', name: 'Assamese Gamosa', region: 'Assam', fact: 'A revered handwoven white and red cotton towel presented as a symbol of deep respect.' },
  '🥁': { icon: '🥁', name: 'Bihu Dhol & Pepa', region: 'North East', fact: 'Traditional two-headed folk drums that echo across paddy fields during Rongali Bihu.' },
  '🛶': { icon: '🛶', name: 'Majuli Country Canoe', region: 'Brahmaputra', fact: 'Traditional wooden boats used by villagers of Majuli, the world’s largest river island.' },
  '🍵': { icon: '🍵', name: 'Assam CTC Garden Tea', region: 'Upper Assam', fact: 'Rich malty amber tea picked by hand amidst the lush greenery of the Brahmaputra valley.' },
  '🌸': { icon: '🌸', name: 'Kopou Phool (Foxtail Orchid)', region: 'Assam & Arunachal', fact: 'The delicate purple orchid worn by Bihu dancers in their hair during spring.' },
  '🐘': { icon: '🐘', name: 'Karbi Anglong Elephant', region: 'Assam', fact: 'Gentle wild giants that roam the misty foothills and sacred forests of the North East.' },
  '🎋': { icon: '🎋', name: 'Bamboo Crafts & Jaapi', region: 'Nagaland & Mizoram', fact: 'Sustainable bamboo architecture, Jaapi sun-hats, and woven handicrafts of the hills.' },
};

const MOTIF_KEYS = Object.keys(MOTIF_INFO);

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryCards({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastMatchedMotif, setLastMatchedMotif] = useState<CulturalMotif | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...MOTIF_KEYS, ...MOTIF_KEYS]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
    setLastMatchedMotif(null);
  };

  const logGameActivity = (finalMoves: number) => {
    const score = Math.max(50, Math.min(100, Math.round(100 - (finalMoves - 8) * 4)));
    logActivity('Cultural Memory Cards', score, { moves: finalMoves });
  };

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched) return;

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlippedIndices.length === 2) {
      const currentMoves = moves + 1;
      setMoves(currentMoves);
      setIsChecking(true);
      
      const [first, second] = newFlippedIndices;
      if (newCards[first].content === newCards[second].content) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setIsChecking(false);
        const motifKey = newCards[first].content;
        if (MOTIF_INFO[motifKey]) {
          setLastMatchedMotif(MOTIF_INFO[motifKey]);
        }
        
        if (newCards.every(card => card.isMatched)) {
          setIsWon(true);
          logGameActivity(currentMoves);
        }
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsChecking(false);
        }, 850);
      }
    }
  };

  return (
    <div className="h-full w-full bg-[#faf8f5] flex flex-col p-4 sm:p-6 overflow-y-auto relative">
      <header className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-3 bg-white border border-stone-200 rounded-full shadow-2xs hover:bg-stone-50">
            <ArrowLeft className="w-6 h-6 text-stone-700" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <span>Cultural Memory Cards</span>
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-semibold border border-stone-200">Heritage</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">Flip cards to match the sacred symbols of Assam & North East</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm sm:text-base font-bold text-stone-900 bg-white border border-stone-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
            Moves: {moves}
          </span>
          <button onClick={startNewGame} className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-2xs transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Cultural Fact Popup Banner on Match */}
      {lastMatchedMotif && (
        <div className="mb-4 bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs animate-gentle-in">
          <span className="text-3xl p-2 bg-stone-50 rounded-xl border border-stone-200">{lastMatchedMotif.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-stone-900">{lastMatchedMotif.name}</h4>
              <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-md border border-stone-200">{lastMatchedMotif.region}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{lastMatchedMotif.fact}</p>
          </div>
        </div>
      )}

      {/* Grid of Cards */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-xl">
          {cards.map((card, index) => {
            const isRevealed = card.isFlipped || card.isMatched;
            const motif = MOTIF_INFO[card.content];
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={card.isMatched || isChecking}
                className={`h-24 sm:h-28 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center relative select-none shadow-2xs ${
                  card.isMatched
                    ? 'bg-stone-50 border-stone-300 opacity-80'
                    : isRevealed
                    ? 'bg-white border-stone-400 scale-[1.02]'
                    : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300 cursor-pointer active:scale-95'
                }`}
              >
                {isRevealed ? (
                  <>
                    <span className="text-3xl sm:text-4xl">{card.content}</span>
                    <span className="text-[10px] font-bold text-stone-700 mt-1 line-clamp-1 px-1">
                      {motif?.name?.split(' ')[0] || ''}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-stone-400">
                    <Sparkles className="w-5 h-5 mb-1 opacity-70" />
                    <span className="text-[10px] font-semibold">Tap</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Modal */}
      {isWon && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center border border-stone-200 shadow-xl">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3 text-stone-800 border border-stone-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-1">Praiseworthy Memory!</h2>
            <p className="text-sm text-stone-600 font-medium mb-4">
              Matched all motifs in <strong className="text-stone-900">{moves} moves</strong>.
            </p>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 mb-5 text-stone-700 font-medium text-xs">
              Telemetry logged: Cognitive working memory retention registered as healthy.
            </div>
            <div className="space-y-2">
              <button
                onClick={startNewGame}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm shadow-2xs transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
