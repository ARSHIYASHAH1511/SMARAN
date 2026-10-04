import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { logActivity } from '../../lib/activityStore';

const MOTIFS = ['🦏', '🧣', '🥁', '🛶', '🍵', '🌸', '🐘', '🎋', '🦚', '🌞', '🛶', '🪔'];

interface Tile {
  id: string;
  type: string;
  layer: number;
  row: number;
  col: number;
  isCovered: boolean;
  status: 'board' | 'hand' | 'cleared';
}

type Difficulty = 'easy' | 'medium' | 'hard';

export default function MotifMatch({ onBack }: { onBack: () => void }) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [hand, setHand] = useState<Tile[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  const startNewGame = async (diff: Difficulty) => {
    setIsGenerating(true);
    setGameOver(false);
    setWin(false);
    setHand([]);
    
    setTimeout(() => {
      let solvable = false;
      let attempt = 0;
      let generatedTiles: Tile[] = [];
      while (!solvable && attempt < 10) {
        attempt++;
        generatedTiles = generateBoard(diff);
        solvable = isBoardSolvable(generatedTiles);
      }
      
      if (!solvable) {
         generatedTiles = generateFlatBoard(diff);
      }
      setTiles(generatedTiles);
      setIsGenerating(false);
    }, 50);
  };

  const getDifficultyParams = (diff: Difficulty) => {
    switch(diff) {
      case 'easy': return { types: 6, setsOfThree: 1, maxLayers: 2, cols: 4, rows: 4 };
      case 'hard': return { types: 12, setsOfThree: 2, maxLayers: 5, cols: 6, rows: 5 };
      case 'medium': 
      default: return { types: 12, setsOfThree: 1, maxLayers: 3, cols: 5, rows: 5 };
    }
  };

  const generateBoard = (diff: Difficulty): Tile[] => {
    const { types, setsOfThree, maxLayers, cols, rows } = getDifficultyParams(diff);
    let newTiles: Tile[] = [];
    
    const pool: string[] = [];
    const selectedMotifs = MOTIFS.slice(0, types);
    selectedMotifs.forEach(m => {
      for(let i=0; i<3 * setsOfThree; i++) pool.push(m);
    });
    
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    for (let i = 0; i < pool.length; i++) {
      const type = pool[i];
      let placed = false;
      let placementAttempts = 0;
      while (!placed && placementAttempts < 200) {
        placementAttempts++;
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        const layer = Math.floor(Math.random() * maxLayers);

        const conflict = newTiles.find(t => t.row === r && t.col === c && t.layer === layer);
        
        if (!conflict) {
          newTiles.push({
            id: uuidv4(),
            type,
            layer,
            row: r,
            col: c,
            isCovered: false,
            status: 'board'
          });
          placed = true;
        }
      }
      
      if (!placed) {
        let found = false;
        for (let l = 0; l < maxLayers; l++) {
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (!newTiles.find(t => t.row === r && t.col === c && t.layer === l)) {
                newTiles.push({
                  id: uuidv4(), type, layer: l, row: r, col: c, isCovered: false, status: 'board'
                });
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (found) break;
        }
      }
    }
    return updateCoveredState(newTiles);
  };

  const generateFlatBoard = (diff: Difficulty): Tile[] => {
    const { types, setsOfThree, cols, rows } = getDifficultyParams(diff);
    let newTiles: Tile[] = [];
    const pool: string[] = [];
    MOTIFS.slice(0, types).forEach(m => {
      for(let i=0; i<3 * setsOfThree; i++) pool.push(m);
    });
    
    const layerSize = cols * rows;
    pool.forEach((type, index) => {
        newTiles.push({
            id: uuidv4(),
            type,
            layer: Math.floor(index / layerSize),
            row: Math.floor((index % layerSize) / cols),
            col: (index % cols),
            isCovered: false,
            status: 'board'
        });
    });
    return updateCoveredState(newTiles);
  };

  const updateCoveredState = (currentTiles: Tile[]) => {
    return currentTiles.map(t => {
      if (t.status !== 'board') return t;
      const isCovered = currentTiles.some(other => 
        other.status === 'board' &&
        other.id !== t.id &&
        other.layer > t.layer &&
        other.row === t.row && 
        other.col === t.col
      );
      return { ...t, isCovered };
    });
  };

  const isBoardSolvable = (initialTiles: Tile[]): boolean => {
    let tiles = JSON.parse(JSON.stringify(initialTiles)) as Tile[];
    let currentHand: string[] = [];
    
    let progress = true;
    while (progress) {
      progress = false;
      const playableTiles = tiles.filter(t => t.status === 'board' && !t.isCovered);
      if (playableTiles.length === 0) break;
      
      const typeCounts = playableTiles.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      let bestType = Object.keys(typeCounts).find(type => typeCounts[type] >= 3);
      
      if (!bestType) {
        const handCounts = currentHand.reduce((acc, type) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        bestType = Object.keys(handCounts).find(type => {
          const needed = 3 - handCounts[type];
          return typeCounts[type] >= needed && (currentHand.length + needed <= 7);
        });
      }
      
      if (bestType) {
        let collected = 0;
        tiles = tiles.map(t => {
          if (t.status === 'board' && !t.isCovered && t.type === bestType && collected < 3) {
            collected++;
            return { ...t, status: 'cleared' };
          }
          return t;
        });
        
        currentHand = currentHand.filter(type => type !== bestType);
        tiles = updateCoveredState(tiles);
        progress = true;
      }
    }
    
    return tiles.every(t => t.status === 'cleared');
  };

  const handleTileClick = (tileId: string) => {
    if (gameOver || win || isGenerating) return;
    const clickedTile = tiles.find(t => t.id === tileId);
    if (!clickedTile || clickedTile.isCovered || clickedTile.status !== 'board') return;
    if (hand.length >= 7) return;

    let newTiles = tiles.map(t => t.id === tileId ? { ...t, status: 'hand' as const } : t);
    let newHand = [...hand, { ...clickedTile, status: 'hand' as const }];
    newHand.sort((a, b) => a.type.localeCompare(b.type));

    const typeCounts = newHand.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count >= 3) {
        newHand = newHand.filter(t => t.type !== type);
        newTiles = newTiles.map(t => t.type === type && t.status === 'hand' ? { ...t, status: 'cleared' as const } : t);
      }
    });

    newTiles = updateCoveredState(newTiles);
    setHand(newHand);
    setTiles(newTiles);

    const remainingBoard = newTiles.filter(t => t.status === 'board').length;
    if (remainingBoard === 0 && newHand.length === 0) {
      setWin(true);
      logActivity('Motif Match', 100, { difficulty, status: 'win' });
    } else if (newHand.length >= 7) {
      setGameOver(true);
      const totalInitial = newTiles.length;
      const cleared = newTiles.filter(t => t.status === 'cleared').length;
      const score = Math.floor((cleared / totalInitial) * 100);
      logActivity('Motif Match', score, { difficulty, status: 'loss' });
    }
  };

  return (
    <div className="h-full w-full bg-[#faf8f5] flex flex-col p-4 sm:p-6 overflow-hidden relative">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full sm:w-auto justify-between">
          <button onClick={onBack} className="p-3 bg-white border border-stone-200 rounded-full shadow-2xs hover:bg-stone-50 mr-4">
            <ArrowLeft className="w-6 h-6 text-stone-700" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Motif Match</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-stone-200 p-1.5 rounded-full shadow-2xs">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm capitalize transition-colors ${
                difficulty === d ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {d}
            </button>
          ))}
          <button onClick={() => startNewGame(difficulty)} className="p-1.5 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-700 ml-1">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <div className="flex-1 relative w-full max-w-3xl mx-auto flex items-center justify-center border border-stone-200 bg-white rounded-3xl mb-6 shadow-2xs overflow-hidden">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center text-stone-600">
            <Loader2 className="w-12 h-12 animate-spin mb-3" />
            <h2 className="text-xl font-bold">Creating a solvable board...</h2>
          </div>
        ) : (
          <div className="relative w-[340px] h-[340px] sm:w-[540px] sm:h-[540px]">
            {tiles.filter(t => t.status === 'board').map(tile => {
              const { cols, rows } = getDifficultyParams(difficulty);
              const tileWidth = 100 / cols;
              const tileHeight = 100 / rows;
              
              return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                disabled={tile.isCovered}
                className={`absolute flex items-center justify-center text-3xl sm:text-4xl rounded-2xl border transition-all duration-200 ${
                  tile.isCovered 
                    ? 'bg-stone-200 border-stone-300 opacity-50 cursor-not-allowed scale-[0.88]' 
                    : 'bg-white border-stone-200 hover:border-stone-400 shadow-2xs active:scale-95 cursor-pointer z-30 scale-[0.96]'
                }`}
                style={{
                  width: `${tileWidth}%`,
                  height: `${tileHeight}%`,
                  left: `${tile.col * tileWidth}%`,
                  top: `${tile.row * tileHeight}%`,
                  zIndex: tile.isCovered ? tile.layer * 10 : (tile.layer * 10) + 20,
                  transform: `translate(${tile.layer * -5}px, ${tile.layer * -5}px)`,
                }}
              >
                <span>{tile.type}</span>
              </button>
            )})}
          </div>
        )}
      </div>

      {/* Hand (Dock) */}
      <div className="h-24 bg-white border border-stone-200 rounded-3xl shadow-2xs flex items-center justify-center px-2 sm:px-4 gap-1.5 sm:gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-10 h-14 sm:w-14 sm:h-18 bg-stone-50 rounded-xl border border-dashed border-stone-300 flex items-center justify-center shrink-0">
            {hand[i] && (
               <div className="w-full h-full bg-white rounded-xl border border-stone-300 flex items-center justify-center text-2xl sm:text-3xl shadow-2xs">
                 {hand[i].type}
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Overlays */}
      {(gameOver || win) && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-7 rounded-3xl text-center max-w-sm w-full border border-stone-200 shadow-xl">
            <h2 className="text-3xl font-extrabold mb-2 text-stone-900">
              {win ? 'Praiseworthy Match!' : 'Tray Filled'}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mb-6 font-medium">
              {win ? 'Wonderful job matching all the North Eastern cultural motifs.' : 'No more slots in your tray. Let us try once more.'}
            </p>
            <div className="space-y-2.5">
              <button 
                onClick={() => startNewGame(difficulty)}
                className="w-full py-3 text-base font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-2xs transition-colors"
              >
                Play Again
              </button>
              <button 
                onClick={onBack}
                className="w-full py-3 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
