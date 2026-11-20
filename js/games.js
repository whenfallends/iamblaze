function initTetris() {
  const windowEl = document.getElementById("tetris-window");
  const boardEl = document.getElementById("tetris-board");
  const statusEl = document.getElementById("tetris-status");
  const scoreEl = document.getElementById("tetris-score");
  const linesEl = document.getElementById("tetris-lines");
  const startBtn = document.getElementById("tetris-start-btn");
  const newBtn = document.getElementById("tetris-new-btn");
  const width = 10;
  const height = 20;
  const shapes = [
    { type: "i", cells: [[1, 1, 1, 1]] },
    { type: "o", cells: [[1, 1], [1, 1]] },
    { type: "t", cells: [[0, 1, 0], [1, 1, 1]] },
    { type: "s", cells: [[0, 1, 1], [1, 1, 0]] },
    { type: "z", cells: [[1, 1, 0], [0, 1, 1]] },
    { type: "j", cells: [[1, 0, 0], [1, 1, 1]] },
    { type: "l", cells: [[0, 0, 1], [1, 1, 1]] }
  ];

  let board;
  let cells;
  let current;
  let score = 0;
  let clearedLines = 0;
  let timer = null;
  let running = false;
  let gameOver = false;

  for (let i = 0; i < width * height; i += 1) {
    const cell = document.createElement("div");
    cell.className = "tetris-cell";
    cell.setAttribute("role", "gridcell");
    boardEl.appendChild(cell);
  }
  cells = Array.from(boardEl.children);

  function rotate(matrix) {
    return matrix[0].map((_, column) => matrix.map((row) => row[column]).reverse());
  }

  function collides(piece, dx, dy, matrix) {
    const shape = matrix || piece.cells;
    return shape.some((row, y) => row.some((value, x) => {
      if (!value) return false;
      const nextX = piece.x + x + dx;
      const nextY = piece.y + y + dy;
      return nextX < 0 || nextX >= width || nextY >= height ||
        (nextY >= 0 && board[nextY][nextX] !== null);
    }));
  }

  function render() {
    cells.forEach((cell, index) => {
      const row = Math.floor(index / width);
      const column = index % width;
      const lockedType = board[row][column];
      let activeType = null;

      if (current) {
        const pieceRow = row - current.y;
        const pieceColumn = column - current.x;
        if (current.cells[pieceRow] && current.cells[pieceRow][pieceColumn]) {
          activeType = current.type;
        }
      }

      const type = activeType || lockedType;
      cell.className = `tetris-cell${type ? ` piece-${type}` : ""}`;
    });

    scoreEl.textContent = String(score);
    linesEl.textContent = String(clearedLines);
  }

  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    running = false;
    startBtn.textContent = gameOver ? "Play Again" : "Resume";
  }

  function spawnPiece() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    current = {
      type: shape.type,
      cells: shape.cells.map((row) => row.slice()),
      x: Math.floor((width - shape.cells[0].length) / 2),
      y: 0
    };

    if (collides(current, 0, 0)) {
      gameOver = true;
      stopTimer();
      statusEl.textContent = "Game over";
      startBtn.textContent = "Play Again";
    }
    render();
  }

  function reset() {
    stopTimer();
    board = Array.from({ length: height }, () => Array(width).fill(null));
    current = null;
    score = 0;
    clearedLines = 0;
    gameOver = false;
    startBtn.textContent = "Start";
    statusEl.textContent = "Press Start to play";
    spawnPiece();
  }

  function lockPiece() {
    current.cells.forEach((row, y) => row.forEach((value, x) => {
      if (!value) return;
      const boardY = current.y + y;
      const boardX = current.x + x;
      if (boardY < 0) {
        gameOver = true;
        return;
      }
      board[boardY][boardX] = current.type;
    }));

    if (gameOver) {
      stopTimer();
      statusEl.textContent = "Game over";
      render();
      return;
    }

    let rowsCleared = 0;
    for (let row = height - 1; row >= 0; row -= 1) {
      if (board[row].every(Boolean)) {
        board.splice(row, 1);
        board.unshift(Array(width).fill(null));
        rowsCleared += 1;
        row += 1;
      }
    }

    if (rowsCleared > 0) {
      clearedLines += rowsCleared;
      score += [0, 100, 300, 500, 800][rowsCleared] || rowsCleared * 200;
    }
    spawnPiece();
  }

  function stepDown() {
    if (!current || gameOver) return;
    if (!collides(current, 0, 1)) {
      current.y += 1;
      render();
    } else {
      lockPiece();
    }
  }

  function start() {
    if (gameOver) reset();
    if (running) return;
    running = true;
    statusEl.textContent = "Playing";
    startBtn.textContent = "Pause";
    boardEl.focus();
    timer = setInterval(stepDown, 600);
  }

  startBtn.addEventListener("click", () => {
    if (running) {
      stopTimer();
      statusEl.textContent = "Paused";
    } else {
      start();
    }
  });
  newBtn.addEventListener("click", reset);

  boardEl.addEventListener("click", () => boardEl.focus());
  document.addEventListener("keydown", (event) => {
    if (windowEl.classList.contains("hidden") ||
        !windowEl.classList.contains("active-window") ||
        !running ||
        event.target.closest("input, textarea, select, button")) return;

    if (event.key === "ArrowLeft" && !collides(current, -1, 0)) {
      current.x -= 1;
    } else if (event.key === "ArrowRight" && !collides(current, 1, 0)) {
      current.x += 1;
    } else if (event.key === "ArrowDown") {
      if (!collides(current, 0, 1)) {
        current.y += 1;
        score += 1;
      } else {
        lockPiece();
      }
    } else if (event.key === "ArrowUp") {
      const rotated = rotate(current.cells);
      if (!collides(current, 0, 0, rotated)) current.cells = rotated;
    } else if (event.code === "Space") {
      while (!collides(current, 0, 1)) {
        current.y += 1;
        score += 2;
      }
      lockPiece();
    } else {
      return;
    }

    event.preventDefault();
    render();
  });

  reset();
}

function initChess() {
  const boardEl = document.getElementById("chess-board");
  const statusEl = document.getElementById("chess-status");
  const newBtn = document.getElementById("chess-new-btn");
  const pieceSymbols = {
    K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
    k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟"
  };
  const pieceNames = {
    K: "white king", Q: "white queen", R: "white rook", B: "white bishop", N: "white knight", P: "white pawn",
    k: "black king", q: "black queen", r: "black rook", b: "black bishop", n: "black knight", p: "black pawn"
  };
  let board;
  let turn;
  let selected = null;
  let legalTargets = [];
  let gameOver = false;

  function createInitialBoard() {
    const next = Array.from({ length: 8 }, () => Array(8).fill(null));
    const backRank = "rnbqkbnr";
    for (let column = 0; column < 8; column += 1) {
      next[0][column] = backRank[column];
      next[1][column] = "p";
      next[6][column] = "P";
      next[7][column] = backRank[column].toUpperCase();
    }
    return next;
  }

  function sideOf(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? "white" : "black";
  }

  function inside(row, column) {
    return row >= 0 && row < 8 && column >= 0 && column < 8;
  }

  function clearPath(fromRow, fromColumn, toRow, toColumn, state) {
    const rowStep = Math.sign(toRow - fromRow);
    const columnStep = Math.sign(toColumn - fromColumn);
    let row = fromRow + rowStep;
    let column = fromColumn + columnStep;

    while (row !== toRow || column !== toColumn) {
      if (state[row][column]) return false;
      row += rowStep;
      column += columnStep;
    }
    return true;
  }

  function attacksSquare(piece, fromRow, fromColumn, toRow, toColumn, state) {
    const rowDelta = toRow - fromRow;
    const columnDelta = toColumn - fromColumn;
    const absRow = Math.abs(rowDelta);
    const absColumn = Math.abs(columnDelta);
    const type = piece.toLowerCase();

    if (type === "p") {
      const direction = sideOf(piece) === "white" ? -1 : 1;
      return rowDelta === direction && absColumn === 1;
    }
    if (type === "n") return (absRow === 2 && absColumn === 1) || (absRow === 1 && absColumn === 2);
    if (type === "k") return Math.max(absRow, absColumn) === 1;
    if (type === "r" && rowDelta !== 0 && columnDelta !== 0) return false;
    if (type === "b" && absRow !== absColumn) return false;
    if (type === "q" && rowDelta !== 0 && columnDelta !== 0 && absRow !== absColumn) return false;
    if (type !== "r" && type !== "b" && type !== "q") return false;
    return clearPath(fromRow, fromColumn, toRow, toColumn, state);
  }

  function isInCheck(side, state) {
    const king = side === "white" ? "K" : "k";
    let kingRow = -1;
    let kingColumn = -1;
    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 8; column += 1) {
        if (state[row][column] === king) {
          kingRow = row;
          kingColumn = column;
        }
      }
    }
    if (kingRow < 0) return true;

    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 8; column += 1) {
        const piece = state[row][column];
        if (piece && sideOf(piece) !== side &&
            attacksSquare(piece, row, column, kingRow, kingColumn, state)) return true;
      }
    }
    return false;
  }

  function isPseudoLegalMove(fromRow, fromColumn, toRow, toColumn, side, state) {
    if (!inside(toRow, toColumn) || (fromRow === toRow && fromColumn === toColumn)) return false;
    const piece = state[fromRow][fromColumn];
    if (!piece || sideOf(piece) !== side) return false;
    const target = state[toRow][toColumn];
    if (sideOf(target) === side || (target && target.toLowerCase() === "k")) return false;

    const rowDelta = toRow - fromRow;
    const columnDelta = toColumn - fromColumn;
    const absRow = Math.abs(rowDelta);
    const absColumn = Math.abs(columnDelta);
    const type = piece.toLowerCase();

    if (type === "p") {
      const direction = side === "white" ? -1 : 1;
      const startRow = side === "white" ? 6 : 1;
      if (columnDelta === 0 && !target) {
        if (rowDelta === direction) return true;
        return fromRow === startRow && rowDelta === direction * 2 &&
          !state[fromRow + direction][fromColumn];
      }
      return absColumn === 1 && rowDelta === direction && Boolean(target);
    }
    if (type === "n") return (absRow === 2 && absColumn === 1) || (absRow === 1 && absColumn === 2);
    if (type === "k") return Math.max(absRow, absColumn) === 1;
    if (type === "r" && rowDelta !== 0 && columnDelta !== 0) return false;
    if (type === "b" && absRow !== absColumn) return false;
    if (type === "q" && rowDelta !== 0 && columnDelta !== 0 && absRow !== absColumn) return false;
    if (type !== "r" && type !== "b" && type !== "q") return false;
    return clearPath(fromRow, fromColumn, toRow, toColumn, state);
  }

  function isLegalMove(fromRow, fromColumn, toRow, toColumn, side, state) {
    if (!isPseudoLegalMove(fromRow, fromColumn, toRow, toColumn, side, state)) return false;
    const next = state.map((row) => row.slice());
    next[toRow][toColumn] = next[fromRow][fromColumn];
    next[fromRow][fromColumn] = null;
    const movedPiece = next[toRow][toColumn];
    if (movedPiece === "P" && toRow === 0) next[toRow][toColumn] = "Q";
    if (movedPiece === "p" && toRow === 7) next[toRow][toColumn] = "q";
    return !isInCheck(side, next);
  }

  function getLegalTargets(row, column) {
    const targets = [];
    for (let targetRow = 0; targetRow < 8; targetRow += 1) {
      for (let targetColumn = 0; targetColumn < 8; targetColumn += 1) {
        if (isLegalMove(row, column, targetRow, targetColumn, turn, board)) {
          targets.push(`${targetRow},${targetColumn}`);
        }
      }
    }
    return targets;
  }

  function hasLegalMove(side) {
    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 8; column += 1) {
        if (sideOf(board[row][column]) !== side) continue;
        for (let targetRow = 0; targetRow < 8; targetRow += 1) {
          for (let targetColumn = 0; targetColumn < 8; targetColumn += 1) {
            if (isLegalMove(row, column, targetRow, targetColumn, side, board)) return true;
          }
        }
      }
    }
    return false;
  }

  function render() {
    boardEl.innerHTML = "";
    let checkedKing = null;
    if (isInCheck(turn, board)) {
      const king = turn === "white" ? "K" : "k";
      for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 8; column += 1) {
          if (board[row][column] === king) checkedKing = `${row},${column}`;
        }
      }
    }

    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 8; column += 1) {
        const piece = board[row][column];
        const key = `${row},${column}`;
        const square = document.createElement("button");
        square.type = "button";
        square.className = `chess-square ${(row + column) % 2 === 0 ? "light" : "dark"}`;
        square.dataset.row = String(row);
        square.dataset.column = String(column);
        square.setAttribute("role", "gridcell");
        const file = String.fromCharCode(97 + column);
        const rank = String(8 - row);
        square.setAttribute("aria-label", `${file}${rank}${piece ? `, ${pieceNames[piece]}` : ""}`);
        if (selected === key) square.classList.add("selected");
        if (legalTargets.includes(key)) {
          square.classList.add(piece ? "legal-capture" : "legal-move");
        }
        if (checkedKing === key) square.classList.add("in-check");

        if (piece) {
          const glyph = document.createElement("span");
          glyph.className = `chess-piece ${sideOf(piece)}-piece`;
          glyph.textContent = pieceSymbols[piece];
          square.appendChild(glyph);
        }
        boardEl.appendChild(square);
      }
    }
  }

  function makeMove(fromRow, fromColumn, toRow, toColumn) {
    const movedPiece = board[fromRow][fromColumn];
    board[toRow][toColumn] = movedPiece;
    board[fromRow][fromColumn] = null;
    if (movedPiece === "P" && toRow === 0) board[toRow][toColumn] = "Q";
    if (movedPiece === "p" && toRow === 7) board[toRow][toColumn] = "q";
    turn = turn === "white" ? "black" : "white";
    selected = null;
    legalTargets = [];

    const inCheck = isInCheck(turn, board);
    const canMove = hasLegalMove(turn);
    if (!canMove) {
      gameOver = true;
      statusEl.textContent = inCheck
        ? `${turn === "white" ? "Black" : "White"} wins by checkmate`
        : "Draw by stalemate";
    } else {
      statusEl.textContent = `${turn === "white" ? "White" : "Black"} to move${inCheck ? " — check" : ""}`;
    }
    render();
  }

  boardEl.addEventListener("click", (event) => {
    const square = event.target.closest(".chess-square");
    if (!square || gameOver) return;
    const row = Number(square.dataset.row);
    const column = Number(square.dataset.column);
    const key = `${row},${column}`;
    const piece = board[row][column];

    if (selected && legalTargets.includes(key)) {
      const [fromRow, fromColumn] = selected.split(",").map(Number);
      makeMove(fromRow, fromColumn, row, column);
      return;
    }

    if (piece && sideOf(piece) === turn) {
      selected = key;
      legalTargets = getLegalTargets(row, column);
    } else {
      selected = null;
      legalTargets = [];
    }
    render();
  });

  newBtn.addEventListener("click", reset);

  function reset() {
    board = createInitialBoard();
    turn = "white";
    selected = null;
    legalTargets = [];
    gameOver = false;
    statusEl.textContent = "White to move";
    render();
  }

  reset();
}

document.addEventListener("DOMContentLoaded", () => {
  initTetris();
  initChess();
});
