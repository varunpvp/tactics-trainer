import React, { useState, useEffect } from "react";
import { ChessInstance, ShortMove } from "chess.js";
import Chessboard from "chessboardjsx";
import Tactic from "../types/Tactic";

const Chess = require("chess.js");

interface Props {
  tactic: Tactic;
  onIncorrect: () => void;
  onSolve: () => void;
}

const TacticBoard: React.FC<Props> = ({ tactic, onIncorrect, onSolve }) => {
  const [fen, setFen] = useState(tactic.fen);
  const [orientation] = useState(getSideToPlayFromFen(tactic.fen));
  const [solution, setSolution] = useState(tactic.solution);

  useEffect(() => {
    setTimeout(() => {
      const next = makeMove(tactic.fen, tactic.blunderMove);
      if (next) {
        setFen(next.fen);
      }
    }, 100);
  }, [tactic]);

  const handleMove = (move: string | ShortMove) => {
    const next = validateMove(fen, move, solution);

    if (next) {
      setFen(next.fen);
      setSolution(next.solution);

      if (next.solution.length > 0) {
        const autoNext = validateMove(
          next.fen,
          next.solution[0],
          next.solution
        );

        if (autoNext) {
          setFen(autoNext.fen);
          setSolution(autoNext.solution);
        }
      } else {
        onSolve();
      }
    } else {
      onIncorrect();
    }
  };

  return (
    <Chessboard
      transitionDuration={200}
      position={fen}
      width={400}
      orientation={orientation === "b" ? "white" : "black"}
      onDrop={(move) =>
        handleMove({
          from: move.sourceSquare,
          to: move.targetSquare,
          promotion: "q",
        })
      }
    />
  );
};

function getSideToPlayFromFen(fen: string) {
  const chess: ChessInstance = new Chess(fen);
  return chess.turn();
}

function makeMove(fen: string, move: ShortMove | string) {
  const chess: ChessInstance = new Chess(fen);
  const fullMove = chess.move(move);
  return fullMove ? { fullMove, fen: chess.fen() } : null;
}

function validateMove(
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

export default TacticBoard;
