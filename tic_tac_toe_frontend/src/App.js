import React, { useMemo, useState } from "react";
import "./App.css";

const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isBoardFull(squares) {
  return squares.every((sq) => sq !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Main entrypoint for the browser Tic Tac Toe game UI. */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);

  const isDraw = !winner && isBoardFull(squares);
  const currentPlayer = xIsNext ? "X" : "O";
  const gameOver = Boolean(winner) || isDraw;

  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw";
    return `Next: ${currentPlayer}`;
  }, [winner, isDraw, currentPlayer]);

  // PUBLIC_INTERFACE
  function resetGame() {
    /** Reset the board and set next player to X. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function handleSquareClick(index) {
    if (gameOver) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  function handleSquareKeyDown(e, index) {
    // Allow keyboard play (Enter/Space triggers the move).
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSquareClick(index);
    }
  }

  return (
    <div className="App">
      <main className="page" aria-label="Tic Tac Toe game">
        <section className="card" aria-label="Game panel">
          <header className="header">
            <div>
              <h1 className="title">Tic Tac Toe</h1>
              <p className="subtitle">Soft Mono • minimalist</p>
            </div>

            <button
              type="button"
              className="btn"
              onClick={resetGame}
              aria-label="Reset game"
            >
              Reset
            </button>
          </header>

          <div className="statusWrap" aria-live="polite" aria-atomic="true">
            <span
              className={[
                "status",
                winner ? "status--win" : "",
                isDraw ? "status--draw" : "",
              ].join(" ")}
            >
              {status}
            </span>
            <span className="hint">
              Tip: Use Tab + Enter/Space to play via keyboard.
            </span>
          </div>

          <div className="boardWrap">
            <div
              className="board"
              role="grid"
              aria-label="3 by 3 Tic Tac Toe board"
            >
              {squares.map((value, i) => {
                const isWinningSquare = line?.includes(i) ?? false;
                const isDisabled = Boolean(value) || gameOver;

                return (
                  <button
                    key={i}
                    type="button"
                    className={[
                      "square",
                      value ? "square--filled" : "",
                      isWinningSquare ? "square--win" : "",
                    ].join(" ")}
                    role="gridcell"
                    aria-label={`Square ${i + 1}${
                      value ? `, ${value}` : ", empty"
                    }`}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    onClick={() => handleSquareClick(i)}
                    onKeyDown={(e) => handleSquareKeyDown(e, i)}
                  >
                    <span className="squareValue" aria-hidden="true">
                      {value ?? ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="footer" aria-label="Game help">
            <div className="legend" aria-label="Player legend">
              <span className="pill pill--x" aria-label="Player X">
                X
              </span>
              <span className="pill pill--o" aria-label="Player O">
                O
              </span>
            </div>

            <p className="micro">
              {winner || isDraw
                ? "Press Reset to play again."
                : "Place three in a row to win."}
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
