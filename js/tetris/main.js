const canvasBoard = document.getElementById("board");
const ctxBoard = canvasBoard.getContext("2d");
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");

document.addEventListener("keydown", handlePKeyPress);

function handlePKeyPress(event) {
  if (event.keyCode === KEY.P) {
    if (document.querySelector("#play-btn").style.display !== "none") {
      play();
    }
  }
}

let accountValues = {
  score: 0,
  lines: 0,
  level: 0,
};

//Play 실행 함수
let board = new Board(ctxBoard, ctxNext);
//board.reset();
let isPlaying = false;

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
  board.clear();
  time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
  backgroundSound.currentTime = 0;
  isPlaying = true;

  document.addEventListener("keydown", handlePKeyPress);
  document.removeEventListener("keydown", addKeyListener);
}

function play() {
  document.removeEventListener("keydown", handlePKeyPress);
  document.removeEventListener("keydown", addKeyListener);
  addEventListener();
  if (document.querySelector("#play-btn").style.display == "") {
    resetGame();
  }
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
  document.querySelector("#play-btn").style.display = "none";
  document.querySelector("#pause-btn").style.display = "block";
  backgroundSound.play();

  //board.piece = piece;
  isPlaying = true;
}

const moves = {
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.UP]: (p) => board.rotate(p),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
};
function addEventListener() {
  document.removeEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleKeyPress);
}

function removeEventListener() {
  document.removeEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
  removeKeyListener();
  if (event.keyCode === KEY.P) {
    if (isPlaying) {
      console.log(isPlaying);
      pause();
      sound.pause();
    } else {
      console.log(isPlaying);
      play();
    }
    document.removeEventListener("keydown", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
  }
  if (event.keyCode === KEY.ESC) {
    toggleGamePauseMenu();
    escSound.play();
  }
  if (moves[event.keyCode]) {
    event.preventDefault();
    // Get new state
    let p = moves[event.keyCode](board.piece);
    if (event.keyCode === KEY.SPACE) {
      // Hard drop
      if (document.querySelector("#pause-btn").style.display === "block") {
        dropSound.play();
      } else {
        return;
      }

      while (board.valid(p)) {
        account.score += POINTS.HARD_DROP;
        board.piece.move(p);
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();
    } else if (board.valid(p)) {
      board.piece.move(p);
      if (
        event.keyCode === KEY.DOWN &&
        document.querySelector("#pause-btn").style.display === "block"
      ) {
        account.score += POINTS.SOFT_DROP;
      }
    }
  }
}

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

  sound.pause();
  finishSound.play();
  checkHighScore(account.score);

  document.querySelector("#pause-btn").style.display = "none";
  document.querySelector("#play-btn").style.display = "";
}

function pause() {
  removeEventListener();

  if (!requestId) {
    document.querySelector("#play-btn").style.display = "none";
    document.querySelector("#pause-btn").style.display = "block";
    animate();
    backgroundSound.play();
    isPlaying = true;
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctxBoard.fillStyle = "black";
  ctxBoard.fillRect(1, 3, 8, 1.2);
  ctxBoard.font = "1px Arial";
  ctxBoard.fillStyle = "yellow";
  ctxBoard.fillText("PAUSED", 3, 4);
  document.querySelector("#play-btn").style.display = "block";
  document.querySelector("#pause-btn").style.display = "none";
  sound.pause();
  isPlaying = false;
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

  showNicknameScreen();
  function handleNicknameFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("nickname").value;
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    hideNicknameScreen();
    showHighScores();
    showLeaderboard();
  }
  const nicknameForm = document.getElementById("nickname-form");
  nicknameForm.addEventListener("submit", handleNicknameFormSubmit);

  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", () => {
    nicknameForm.removeEventListener("submit", handleNicknameFormSubmit); // 제출 이벤트 리스너 삭제
    hideNicknameScreen(); // 화면 닫기
    showLeaderboard();
  });
}

function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function showNicknameScreen() {
  const nicknameScreen = document.getElementById("nickname-screen");
  nicknameScreen.style.display = "flex"; // 화면 표시
}

function hideNicknameScreen() {
  const nicknameScreen = document.getElementById("nickname-screen");
  nicknameScreen.style.display = "none"; // 화면 숨김
}

function showLeaderboard() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.sort((a, b) => b.score - a.score); // 점수에 따라 내림차순 정렬
  const leaderboardContainer = document.querySelector(".leaderboard-container");
  const leaderboardList =
    leaderboardContainer.querySelector("#leaderboard-list");
  const gameAgainButton =
    leaderboardContainer.querySelector("#game-again-button");
  const gameSelectButton = leaderboardContainer.querySelector(
    "#game-select-button"
  );

  leaderboardList.innerHTML = ""; // 기존 목록 초기화
  const previousTopScore = highScores.length > 0 ? highScores[0].score : -1;
  const currentTopScore = account.score;

  for (let i = 0; i < Math.min(highScores.length, 3); i++) {
    const listItem = document.createElement("li");
    listItem.textContent = `${i + 1}. ${highScores[i].name} - ${
      highScores[i].score
    }`;
    leaderboardList.appendChild(listItem);
    console.log(currentTopScore);
    console.log(previousTopScore);
    if (currentTopScore >= previousTopScore) {
      listItem.classList.add("confetti"); //축하 애니메이션
    }
  }

  leaderboardContainer.style.display = "block"; // leaderboard 보이기

  gameAgainButton.addEventListener("click", () => {
    resetGame();
    hideLeaderboard();
    document.removeEventListener("keydown", addKeyListener);
  });

  gameSelectButton.addEventListener("click", () => {
    returnToSelection();
    hideLeaderboard();
  });

  addKeyListener();
}

function hideLeaderboard() {
  const leaderboardContainer = document.querySelector(".leaderboard-container");
  leaderboardContainer.style.display = "none"; // leaderboard 숨기기
  removeKeyListener();
}

let twobuttonIndex = 0;

let keydownEventListener = null;

function addKeyListener() {
  const leaderboardContainer = document.querySelector(".leaderboard-container");
  const buttons = leaderboardContainer.querySelectorAll("button");
  keydownEventListener = document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      selectButton(-1);
      console.log(buttons);
      escMove.currentTime = 0;
      escMove.play();
    }
    if (event.key === "ArrowRight") {
      selectButton(1);
      escMove.currentTime = 0;
      escMove.play();
    }
    if (event.key === "Enter") {
      buttons[twobuttonIndex].click();
    }
  });
}

function selectButton(direction) {
  const leaderboardContainer = document.querySelector(".leaderboard-container");
  const buttons = leaderboardContainer.querySelectorAll("button");
  twobuttonIndex =
    (twobuttonIndex + direction + buttons.length) % buttons.length;
  buttons.forEach((button, index) => {
    if (index === twobuttonIndex) {
      button.classList.add("select");
    } else {
      button.classList.remove("select");
    }
  });

  return buttons;
}

function removeKeyListener() {
  document.removeEventListener("keydown", addKeyListener);
}

if (leaderboardContainer.style.display !== "none") {
  addKeyListener();
  console.log("addKeyListenr");
} else {
  removeKeyListener();
}
