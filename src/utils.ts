import { ChessInstance, ShortMove } from "chess.js";

const Chess = require("chess.js");

export function getSideToPlayFromFen(fen: string) {
  const chess: ChessInstance = new Chess(fen);
  return chess.turn();
}

export function makeMove(fen: string, move: ShortMove | string) {
  const chess: ChessInstance = new Chess(fen);
  const fullMove = chess.move(move);
  return fullMove ? { fullMove, fen: chess.fen() } : null;
}

export function validateMove(
  fen: string,
  move: ShortMove | string,
  solution: string[]
): null | { solution: string[]; fen: string } {
  if (solution.length === 0) {
    return null;
  }

  const next = makeMove(fen, move);

  if (next && next.fullMove.san === solution[0]) {
    return {
      fen: next.fen,
      solution: solution.slice(1),
    };
  }

  return null;
}
