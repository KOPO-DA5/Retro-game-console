// tetris.js

function loadGameTetris() {
  const content = document.getElementById("content");

  var newStyle = document.createElement("link");
  newStyle.setAttribute("rel", "stylesheet");

  resetAnimation(content); // 애니메이션 초기화
  updateGameContent(); // 콘텐츠 업데이트

  // 애니메이션 시작
  content.classList.add("fade-in");
}

function resetAnimation(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth; // DOM 리플로우 강제 실행으로 CSS 애니메이션 리셋
  element.classList.add("fade-in");
}

let selectedButtonIndex = 0;

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    toggleGamePauseMenu();
  }
  if (event.key === "ArrowUp") {
    selectButton(-1);
    playMenuMoveSound();
  }
  if (event.key === "ArrowDown") {
    selectButton(1);
    playMenuMoveSound();
  }
  if (event.key === "Enter") {
    buttons[selectedButtonIndex].click();
  }
});

function toggleGamePauseMenu() {
  const gameControls = document.getElementById("game-controls");
  // 게임 컨트롤 보이기/숨기기
  gameControls.classList.toggle("hide");

  if (!gameControls.classList.contains("hide")) {
    pause();
    sound.pause();
  } else {
    play();
  }
}

function resumeGame() {
  const gameControls = document.getElementById("game-controls");
  gameControls.classList.add("hide");
  play();
}

function restartGame() {
  const gameControls = document.getElementById("game-controls");
  gameControls.classList.add("hide");
  resetGame();
}

function selectButton(direction) {
  selectedButtonIndex =
    (selectedButtonIndex + direction + buttons.length) % buttons.length;
  buttons.forEach((button, index) => {
    if (index === selectedButtonIndex) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}

// 각 스크립트 파일의 로드 상태를 추적하기 위한 변수들
let constantsLoaded = false;
let boardLoaded = false;
let pieceLoaded = false;
let mainLoaded = false;
let soundLoaded = false;

function updateGameContent() {
  const content = document.getElementById("content");
  content.innerHTML = `
                <link rel="stylesheet" href="./css/tetris.css" />
                <div class="grid">
                  <div class="left-column">
                    <h2>HIGH SCORES</h2>
                    <ol id="highScores"></ol>
                  </div>
                  <div class="game-board-container">
                  <canvas id="board" class="game-board"></canvas>
                  </div>
                 <div class="right-column">
                    <div>
                        <h1>TETRIS</h1>
                        <p>Score: <span id="score">0</span></p>
                        <p>Lines: <span id="lines">0</span></p>
                        <p>Level: <span id="level">0</span></p>
                        <canvas id="next" class="next"></canvas>
                    </div>
                    <div id="sound-div">
                      <span class="sound-item" id="sound-speaker"></span>
                      <span class="sound-item" id="sound-description"></span>
                    </div>
                     <button id="play-btn" onclick="play()" class="play-button">Play</button>
                    <button id="pause-btn" onclick="pause()" class="play-button">Pause</button>

                     <div id="game-controls" class="game-controls hide">
                      <button id="resumeButton" class="control-button" onclick="resumeGame()">game resume</button>
                      <button id="restartButton" class="control-button" onclick="restartGame()">game restart</button>
                      <button id="returnButton" class="control-button" onclick="returnToSelection()">game select</button>
                    </div>
                </div>
            `;

  // constants.js가 로드되지 않았다면 로드
  if (!constantsLoaded) {
    let scriptToConstants = document.createElement("script");
    scriptToConstants.type = "text/javascript";
    scriptToConstants.src = "./js/tetris/constants.js";
    document.body.appendChild(scriptToConstants);
    constantsLoaded = true;
  }

  // board.js가 로드되지 않았다면 로드
  if (!boardLoaded) {
    let scriptToBoard = document.createElement("script");
    scriptToBoard.type = "text/javascript";
    scriptToBoard.src = "./js/tetris/board.js";
    document.body.appendChild(scriptToBoard);
    boardLoaded = true;
  }

  // piece.js가 로드되지 않았다면 로드
  if (!pieceLoaded) {
    let scriptToPiece = document.createElement("script");
    scriptToPiece.type = "text/javascript";
    scriptToPiece.src = "./js/tetris/piece.js";
    document.body.appendChild(scriptToPiece);
    pieceLoaded = true;
  }

  // main.js가 로드되지 않았다면 로드
  if (!mainLoaded) {
    let scriptTomain = document.createElement("script");
    scriptTomain.type = "text/javascript";
    scriptTomain.src = "./js/tetris/main.js";
    document.body.appendChild(scriptTomain);
    mainLoaded = true;
  }

  // sound.js가 로드되지 않았다면 로드
  if (!soundLoaded) {
    let scriptTosound = document.createElement("script");
    scriptTosound.type = "text/javascript";
    scriptTosound.src = "./js/tetris/sound.js";
    document.body.appendChild(scriptTosound);
    soundLoaded = true;
  }

  // 이미 로드된 스크립트를 삭제
  if (constantsLoaded) {
    document
      .querySelectorAll('script[src="./js/tetris/constants.js"]')
      .forEach((script) => script.remove());
  }
  if (boardLoaded) {
    document
      .querySelectorAll('script[src="./js/tetris/board.js"]')
      .forEach((script) => script.remove());
  }
  if (pieceLoaded) {
    document
      .querySelectorAll('script[src="./js/tetris/piece.js"]')
      .forEach((script) => script.remove());
  }
  if (mainLoaded) {
    document
      .querySelectorAll('script[src="./js/tetris/main.js"]')
      .forEach((script) => script.remove());
  }
  if (soundLoaded) {
    document
      .querySelectorAll('script[src="./js/tetris/sound.js"]')
      .forEach((script) => script.remove());
  }
}
