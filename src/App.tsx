import "./App.css";
import { useEffect, useState } from "react";
import Tactic from "./types/Tactic";
import TacticBoard from "./components/TacticBoard";
import axios from "axios";
import { getSideToPlayFromFen } from "./utils/chess";

function App() {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [hint, setHint] = useState<
    "sideToPlay" | "incorrect" | "correct" | "solved"
  >("sideToPlay");

  const loadTactic = async () => {
    try {
      const newTactic = await fetchTactic();
      setTactics((it) => it.concat(newTactic));
      setHint("sideToPlay");
    } catch (error) {
      console.log("Error loading tactic", { error });
    }
  };

  useEffect(() => {
    loadTactic();
    loadTactic();
  }, []);

  if (tactics.length === 0) {
    return <div className="overlay-loading">Loading...</div>;
  }

  const tactic = tactics[0];

  const sideToPlay = getSideToPlayFromFen(tactic.fen);

  return (
    <div className="flex-center">
      <h1>Tactics Trainer</h1>
      <TacticBoard
        key={tactic.id}
        tactic={tactic}
        onCorrect={() => {
          setHint("correct");
          setTimeout(() => setHint("sideToPlay"), 1000);
        }}
        onIncorrect={() => {
          setHint("incorrect");
          setTimeout(() => setHint("sideToPlay"), 1000);
        }}
        onSolve={() => {
          setHint("solved");
          setTactics((it) => it.slice(1));
          loadTactic();
        }}
      />
      {hint === "sideToPlay" && (
        <div className="tactic-hint">
          {sideToPlay === "b" ? "White" : "Black"} to move
        </div>
      )}

      {hint === "correct" && (
        <div className="tactic-hint tactic-hint-success">Correct!</div>
      )}

      {hint === "incorrect" && (
        <div className="tactic-hint tactic-hint-error">Incorrect!</div>
      )}

      {hint === "solved" && (
        <div className="tactic-hint tactic-hint-success">Solved!</div>
      )}
    </div>
  );
}

async function fetchTactic() {
  const res = await axios.post(
    `${process.env.REACT_APP_CHESSBLUNDERS_API}/blunder/get`,
    {
      type: "explore",
    }
  );

  const data = res.data.data;

  return {
    id: data.id,
    fen: data.fenBefore,
    blunderMove: data.blunderMove,
    solution: data.forcedLine,
  };
}

export default App;
