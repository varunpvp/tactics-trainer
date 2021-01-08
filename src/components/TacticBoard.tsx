import React, { useState, useEffect } from "react";
import { ShortMove } from "chess.js";
import Chessboard from "chessboardjsx";
import Tactic from "../types/Tactic";
import { getSideToPlayFromFen, makeMove, validateMove } from "../utils/chess";

interface Props {
  tactic: Tactic;
  onIncorrect: () => void;
  onCorrect: () => void;
  onSolve: () => void;
}

const TacticBoard: React.FC<Props> = ({
  tactic,
  onIncorrect,
  onCorrect,
  onSolve,
}) => {
  const [fen, setFen] = useState(tactic.fen);
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
        onCorrect();

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
      orientation={getSideToPlayFromFen(tactic.fen) === "b" ? "white" : "black"}
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

export default TacticBoard;
