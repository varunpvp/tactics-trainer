import "./App.css";
import { useEffect, useState } from "react";
import Tactic from "./types/Tactic";
import TacticBoard from "./components/TacticBoard";
import axios from "axios";
import { getSideToPlayFromFen } from "./utils";

function App() {
  const [loading, setLoading] = useState(true);
  const [tactic, setTactic] = useState<Tactic>({
    id: "start",
    fen: "start",
    blunderMove: "e4",
    solution: ["e5"],
  });

  const [hint, setHint] = useState<
    "sideToPlay" | "incorrect" | "correct" | "solved"
  >("sideToPlay");

  const sideToPlay = getSideToPlayFromFen(tactic.fen);

  const loadTactic = async () => {
    try {
      setLoading(true);
      setTactic(await fetchTactic());
      setHint("sideToPlay");
    } catch (error) {
      console.log("Error loading tactic", { error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTactic();
  }, []);

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

      {loading && <div className="overlay-loading">Loading...</div>}
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
