import { useEffect } from 'react';
import { useGame, SUITS } from './hooks/useGame';
import { PlayingCard } from './components/PlayingCard';
import { Opponent } from './components/Opponent';
import { Heart, Spade, Diamond, Club, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

const suitIcons = {
  hearts: <Heart className="w-6 h-6 text-red-500 fill-current" />,
  diamonds: <Diamond className="w-6 h-6 text-red-500 fill-current" />,
  spades: <Spade className="w-6 h-6 text-slate-900 fill-current" />,
  clubs: <Club className="w-6 h-6 text-slate-900 fill-current" />,
};

export default function App() {
  const { gameState, playCard, handleDraw, passTurn, resetGame, isValidPlay } = useGame();
  const { players, currentPlayerIndex, discardPile, deck, activeSuit, status, winner, pendingCard, drawPenalty, direction, hasDrawnThisTurn } = gameState;

  const humanPlayer = players[0];
  const isHumanTurn = currentPlayerIndex === 0 && status === 'playing';
  const topCard = discardPile[discardPile.length - 1];

  // AI Turn Logic
  useEffect(() => {
    if (status !== 'playing') return;
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.isHuman) return;

    const timer = setTimeout(() => {
      const validCards = currentPlayer.hand.filter(c => isValidPlay(c, activeSuit, topCard, drawPenalty));

      if (drawPenalty > 0) {
        if (validCards.length > 0) {
          playCard(currentPlayer.id, validCards[0].id);
        } else {
          handleDraw(currentPlayer.id);
        }
      } else {
        if (!hasDrawnThisTurn) {
          if (validCards.length > 0) {
            const non8s = validCards.filter(c => c.rank !== '8');
            const cardToPlay = non8s.length > 0 ? non8s[0] : validCards[0];
            playCard(currentPlayer.id, cardToPlay.id);
          } else {
            handleDraw(currentPlayer.id);
          }
        } else {
          if (validCards.length > 0) {
            playCard(currentPlayer.id, validCards[0].id);
          } else {
            passTurn(currentPlayer.id);
          }
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentPlayerIndex, status, hasDrawnThisTurn, players, activeSuit, topCard, drawPenalty, playCard, handleDraw, passTurn, isValidPlay]);

  return (
    <div className="min-h-screen bg-emerald-900 text-white overflow-hidden flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/30 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold shadow-lg">
            8
          </div>
          <h1 className="text-xl font-bold tracking-tight">Last Card</h1>
        </div>
        <div className="text-emerald-100 font-medium text-sm sm:text-base animate-fade-in">
          {gameState.message}
        </div>
        <button onClick={resetGame} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Restart Game">
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      {/* Play Area */}
      <main className="flex-1 flex flex-col p-2 sm:p-6 justify-between min-h-[300px]">
        {/* Top Opponent */}
        <div className="flex justify-center items-start h-20 sm:h-28">
          <Opponent position="top" player={players[2]} isActive={currentPlayerIndex === 2} />
        </div>

        {/* Middle Area */}
        <div className="flex-1 flex items-center justify-between w-full max-w-5xl mx-auto">
          {/* Left Opponent */}
          <div className="w-20 sm:w-32 flex justify-center">
            <Opponent position="left" player={players[1]} isActive={currentPlayerIndex === 1} />
          </div>

          {/* Center Table */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-8">
            {/* Direction Indicator */}
            <div className="text-emerald-400/50 flex items-center gap-1 sm:gap-2">
              {direction === 1 ? <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" /> : <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6" />}
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Direction</span>
              {direction === 1 ? <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" /> : <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6" />}
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-12">
              {/* Deck */}
              <div className="relative">
                <PlayingCard 
                  faceDown 
                  onClick={isHumanTurn && (!hasDrawnThisTurn || drawPenalty > 0) ? () => handleDraw(humanPlayer.id) : undefined} 
                  className={isHumanTurn && (!hasDrawnThisTurn || drawPenalty > 0) ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-emerald-900 shadow-[0_0_30px_rgba(250,204,21,0.3)]' : ''} 
                />
                <div className="absolute -bottom-6 sm:-bottom-8 left-0 right-0 text-center text-[10px] sm:text-xs text-emerald-200 font-mono bg-black/40 rounded-full py-0.5 sm:py-1">
                  {deck.length} left
                </div>
                {drawPenalty > 0 && (
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-emerald-900 animate-bounce">
                    +{drawPenalty}
                  </div>
                )}
              </div>

              {/* Discard Pile */}
              <div className="relative">
                {discardPile.length > 0 && (
                  <PlayingCard card={topCard} />
                )}
                {/* Active Suit Indicator */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-full p-1.5 sm:p-2 shadow-xl border-2 sm:border-4 border-emerald-900 transform rotate-12">
                  {suitIcons[activeSuit]}
                </div>
              </div>
            </div>
          </div>

          {/* Right Opponent */}
          <div className="w-20 sm:w-32 flex justify-center">
            <Opponent position="right" player={players[3]} isActive={currentPlayerIndex === 3} />
          </div>
        </div>
      </main>

      {/* Player Hand */}
      <div className="p-4 sm:p-8 bg-black/40 backdrop-blur-md border-t border-white/10 z-10 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-2 sm:mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <h2 className="text-base sm:text-lg font-bold">Your Hand</h2>
              {isHumanTurn && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs sm:text-sm font-bold animate-pulse border border-yellow-400/30">Your Turn</span>}
            </div>
            {isHumanTurn && hasDrawnThisTurn && drawPenalty === 0 && (
              <button 
                onClick={() => passTurn(humanPlayer.id)} 
                className="px-4 py-1.5 sm:px-6 sm:py-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-full text-sm sm:text-base font-bold transition-colors shadow-lg"
              >
                Pass Turn
              </button>
            )}
          </div>
          
          <div className="w-full overflow-x-auto pb-6 pt-6 px-2 sm:px-4 flex justify-start md:justify-center scrollbar-hide">
            <div className="flex flex-nowrap">
              {humanPlayer.hand.map((card, i) => {
                const isValid = isHumanTurn && isValidPlay(card, activeSuit, topCard, drawPenalty);
                return (
                  <div 
                    key={card.id} 
                    className="relative -ml-6 sm:-ml-10 first:ml-0 hover:z-20 hover:-translate-y-6 transition-all duration-200 flex-shrink-0"
                    style={{ zIndex: i }}
                  >
                    <PlayingCard 
                      card={card} 
                      onClick={isValid ? () => playCard(humanPlayer.id, card.id) : undefined}
                      disabled={isHumanTurn && !isValid}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Suit Selection Modal */}
      {status === 'suit-selection' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-slate-900 shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-6 text-center">Select New Suit</h3>
            <div className="grid grid-cols-2 gap-4">
              {SUITS.map(suit => (
                <button
                  key={suit}
                  onClick={() => playCard(humanPlayer.id, pendingCard!.id, suit)}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group"
                >
                  <div className="transform group-hover:scale-110 transition-transform">
                    {suitIcons[suit]}
                  </div>
                  <span className="mt-3 font-bold capitalize text-slate-600 group-hover:text-indigo-600">{suit}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {status === 'game-over' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-3xl p-10 max-w-md w-full text-white text-center border border-slate-700 shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-6">{winner === 'You' ? '🎉' : '💀'}</div>
            <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {winner === 'You' ? 'Victory!' : 'Game Over'}
            </h2>
            <p className="text-slate-400 mb-10 text-lg">{winner} has played their last card.</p>
            <button 
              onClick={resetGame} 
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-full font-bold text-lg transition-all w-full shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] hover:-translate-y-1"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
