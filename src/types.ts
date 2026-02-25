export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardType {
  id: string;
  suit: Suit;
  rank: Rank;
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  hand: CardType[];
}

export interface GameState {
  deck: CardType[];
  discardPile: CardType[];
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  activeSuit: Suit;
  drawPenalty: number;
  winner: string | null;
  status: 'playing' | 'suit-selection' | 'game-over';
  message: string;
  pendingCard: CardType | null;
  hasDrawnThisTurn: boolean;
}
