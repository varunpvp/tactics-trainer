import "./App.css";
import { useEffect, useState } from "react";
import Tactic from "./types/Tactic";
import TacticBoard from "./components/TacticBoard";
import axios from "axios";

function App() {
  const [tactic, setTactic] = useState<Tactic>({
    id: "start",
    fen: "start",
    blunderMove: "e4",
    solution: "e5",
  });
  const [loading, setLoading] = useState(true);

  const loadTactic = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://chessblunders.org/api/blunder/get",
        {
          type: "explore",
        }
      );
      const data = res.data.data;
      setTactic({
        id: data.id,
        fen: data.fenBefore,
        blunderMove: data.blunderMove,
        solution: data.forcedLine[0],
      });
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
        onIncorrect={() => console.log("Incorrect")}
        onSolve={() => loadTactic()}
      />
      {loading && <div className="overlay-loading">Loading...</div>}
    </div>
  );
}

export default App;
