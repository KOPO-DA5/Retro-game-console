const canvasBoard = document.getElementById("board");
const ctxBoard = canvasBoard.getContext("2d");
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");

let accountValues = {
  score: 0,
  lines: 0,
  level: 0,
};

//캔버스 크기 계산
ctxBoard.canvas.width = COLS * BLOCK_SIZE;
ctxBoard.canvas.height = ROWS * BLOCK_SIZE;

//블록 크기 변경
ctxBoard.scale(BLOCK_SIZE, BLOCK_SIZE);

//Play 실행 함수
let board = new Board(ctxBoard, ctxNext);
//board.reset();

showHighScores();

ctxNext.canvas.width = 4 * BLOCK_SIZE;
ctxNext.canvas.height = 4 * BLOCK_SIZE;
ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
  console.log(element);
}

let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  },
});

function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board = this.getEmptyBoard();
}

function play() {
  board.reset();
  time = { start: 0, elapsed: 0, level: 1000 };
  //ctxBoard.clearRect(0, 0, ctxBoard.canvas.width, ctxBoard.canvas.height);

  //let piece = new Piece(ctxBoard);
  //piece.draw();
  animate();
  backgroundSound.play();

  //board.piece = piece;
}

moves = {
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.UP]: (p) => board.rotate(p),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
};

document.addEventListener("keydown", (event) => {
  if (event.keyCode === KEY.ESC) {
    gameOver();
  } else if (moves[event.keyCode]) {
    event.preventDefault();

    let p = moves[event.keyCode](board.piece);

    if (event.keyCode === KEY.SPACE) {
      console.log(event.keyCode);
      while (board.valid(p)) {
        account.score += POINTS.HARD_DROP;
        board.piece.move(p);
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();

      ctxBoard.clearRect(0, 0, ctxBoard.canvas.width, ctxBoard.canvas.height);

      //board.piece.draw();
    } else {
      if (board.valid(p)) {
        board.piece.move(p);
        if (event.keyCode === KEY.DOWN) {
          account.score += POINTS.SOFT_DROP;
        }
      }

      ctxBoard.clearRect(0, 0, ctxBoard.canvas.width, ctxBoard.canvas.height);

      //board.piece.draw();
    }
  }
});

function animate(now = 0) {
  time.elapsed = now - time.start;

  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  ctxBoard.clearRect(0, 0, ctxBoard.canvas.width, ctxBoard.canvas.height);

  board.draw();
  requestId = requestAnimationFrame(animate);
}

function gameOver() {
  cancelAnimationFrame(requestId);

  ctxBoard.fillStyle = "black";
  ctxBoard.fillRect(1, 3, 8, 1.2);
  ctxBoard.fillStyle = "red";
  ctxBoard.font = "1px Arial";
  ctxBoard.fillText("GAME OVER", 1.8, 4);

  checkHighScore(account.score);
  sound.pause();
  finishSound.play();
}

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  const highScoreList = document.getElementById("highScores");

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}`)
    .join("");
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    const name = prompt("You got a highscore! Enter name:");
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
}
