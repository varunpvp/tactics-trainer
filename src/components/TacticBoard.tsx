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
  const [chess] = useState<ChessInstance>(new Chess(tactic.fen));
  const [orientation] = useState<"black" | "white">(
    chess.turn() === "w" ? "black" : "white"
  );

  useEffect(() => {
    setTimeout(() => {
      if (chess.move(tactic.blunderMove)) {
        setFen(chess.fen());
      }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMove = (move: ShortMove) => {
    const fullMove = chess.move(move);
    if (fullMove) {
      if (fullMove.san === tactic.solution) {
        setFen(chess.fen());
        onSolve();
      } else {
        chess.undo();
        onIncorrect();
      }
    } else {
      onIncorrect();
    }
  };

  return (
    <Chessboard
      position={fen}
      width={400}
      orientation={orientation}
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
