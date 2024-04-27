const canvasBoard = document.getElementById("board");
const ctxBoard = canvasBoard.getContext("2d");
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");

// const gameControler_tetris = document.write('<script src="./js/gameControler.js"></script>');

let accountValues = {
  score: 0,
  lines: 0,
  level: 0,
};

//Play 실행 함수
let board = new Board(ctxBoard, ctxNext);
//board.reset();

initNext();
showHighScores();

let requestId = null;
let time = null;

function initNext() {
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

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
  // if (document.querySelector("#play-btn").style.display == "") {
  //   resetGame();
  // }

  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
  // document.querySelector("#play-btn").style.display = "none";
  // document.querySelector("#pause-btn").style.display = "block";
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

let isPausedTetris = false;

document.addEventListener("keydown", (event) => {
  gameControl(event.keyCode);
  if (event.keyCode === KEY.ESC) {
    if (!isPausedTetris) {
      backgroundSound.pause();
      escSound.play();
      pause(); //일시정지
    }
  } else if (moves[event.keyCode]) {
    event.preventDefault();

    let p = moves[event.keyCode](board.piece);

    if (event.keyCode === KEY.SPACE) {
      dropSound.play();
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
  } else if (event.keyCode === KEY.UP) {
    selectButton(-1);
    playMenuMoveSound();
  } else if (event.keyCode === KEY.DOWN) {
    selectButton(1);
    playMenuMoveSound();
  } else if (event.keyCode === 13) {
    if (isPausedTetris) {
      buttons[selectedButtonIndex].click();
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

  document.querySelector("#pause-btn").style.display = "none";
  document.querySelector("#play-btn").style.display = "";
}

function pause() {
  if (!requestId) {
    document.querySelector("#play-btn").style.display = "none";
    document.querySelector("#pause-btn").style.display = "block";
    animate();
    backgroundSound.play();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctx.fillStyle = "black";
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = "1px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText("PAUSED", 3, 4);
  document.querySelector("#play-btn").style.display = "block";
  document.querySelector("#pause-btn").style.display = "none";
  sound.pause();
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
