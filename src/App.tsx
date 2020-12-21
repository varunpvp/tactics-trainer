import TacticBoard from "./components/TacticBoard";
import Tactic from "./types/Tactic";
import "./App.css";
import { useState } from "react";

const tactics: Tactic[] = [
  {
    id: "1",
    fen: "rnbqkb1r/ppp2ppp/5n2/3Pp3/4P3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 6",
    blunderMove: "Bb4",
    solution: "Qa4+",
  },
  {
    id: "2",
    fen: "6k1/1N6/p7/8/P2pP1p1/1P1P4/2r2rPP/R5K1 w - - 1 35",
    blunderMove: "h3",
    solution: "Rxg2+",
  },
  {
    id: "3",
    fen: "1r3r1k/4Nppp/p2pb3/q3p3/4P1P1/P4P2/1PP2Q1P/1K1R3R w - - 1 24",
    blunderMove: "Nc6",
    solution: "Qxa3",
  },
  {
    id: "4",
    fen: "5rk1/R1R5/2N3rp/p2p1pp1/1b6/1P2P1P1/P4PP1/6K1 b - - 5 31",
    blunderMove: "f4",
    solution: "Ne5",
  },
  {
    id: "5",
    fen: "3r3k/pb4pp/1pq1Bp2/5P2/P7/1P2Q1P1/4R2P/6K1 w - - 3 32",
    blunderMove: "Rd2",
    solution: "Qc1+",
  },
  {
    id: "6",
    fen: "3qb1k1/8/3P1ppb/1p2Q3/2pB4/2P4P/r3N1P1/1R4K1 w - - 0 36",
    blunderMove: "Qxb5",
    solution: "Bxb5",
  },
];

function App() {
  const [tactic, setTactic] = useState(tactics[0]);

  return (
    <div className="flex-center">
      <h1>Tactics Trainer</h1>
      <TacticBoard
        key={tactic.id}
        tactic={tactic}
        onIncorrect={() => alert("Incorrect")}
        onSolve={() => {
          setTactic(tactics[Math.floor(Math.random() * tactics.length)]);
        }}
      />
    </div>
  );
}

export default App;
