import { Player } from '../types';

export function Opponent({ position, player, isActive }: { position: 'top' | 'left' | 'right', player: Player, isActive: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 sm:gap-2 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-80'}`}>
      <div className={`px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-bold shadow-md transition-colors whitespace-nowrap ${isActive ? 'bg-yellow-400 text-yellow-900 ring-4 ring-yellow-400/30' : 'bg-black/40 text-white'}`}>
        {player.name}
      </div>
      <div className="flex -space-x-3 sm:-space-x-6">
        {player.hand.map((_, i) => (
          <div key={i} className="w-5 h-8 sm:w-8 sm:h-12 rounded bg-indigo-700 border border-white/20 shadow-sm"></div>
        ))}
      </div>
      <div className="text-[9px] sm:text-xs font-mono text-emerald-200 bg-black/40 px-1.5 py-0.5 rounded-full whitespace-nowrap">
        {player.hand.length} cards
      </div>
    </div>
  );
}
