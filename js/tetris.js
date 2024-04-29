// tetris.js
// const coinTetris = document.getElementsByClassName('tetris-coin');

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

let buttonIndex = 0;

function handleMenuKeyPress(event) {
  event.stopPropagation();
  const gameControls = document.getElementById("game-controls");
  if (gameControls) {
    const buttons = gameControls.querySelectorAll("button");
    if (!gameControls.classList.contains("hide")) {
      if (event.key === "ArrowUp") {
        selectThreeButton(-1);
        console.log(buttons[buttonIndex]);
        escMove.currentTime = 0;
        escMove.play();
      }
      if (event.key === "ArrowDown") {
        selectThreeButton(1);
        console.log(buttons[buttonIndex]);
        escMove.currentTime = 0;
        escMove.play();
      }
      if (event.key === "Escape") {
        buttons[buttonIndex].click();
        console.log(buttons[buttonIndex]);
      }
    }
  }
}

let isEventListener = false;

function toggleGamePauseMenu() {
  const gameControls = document.getElementById("game-controls");
  // 게임 컨트롤 보이기/숨기기
  gameControls.classList.toggle("hide");

  if (!isEventListener) {
    addMenuEventListener(); // 항상 이벤트 리스너를 추가
    isEventListener = true;
  }

  if (!gameControls.classList.contains("hide")) {
    pause();
    sound.pause();
  } else {
    play();
  }
}
function addMenuEventListener() {
  document.addEventListener("keydown", handleMenuKeyPress);
}

function removeMenuEventListener() {
  document.removeEventListener("keydown", handleMenuKeyPress);
}

function resumeGame() {
  const gameControls = document.getElementById("game-controls");
  gameControls.classList.add("hide");
  play();
}

function restartGame() {
  if (coin > 0) {
    coin -= 1;
    console.log("테트리스-코인: " + coin);
    const gameControls = document.getElementById("game-controls");
    gameControls.classList.add("hide");
    resetGame();
  } else {
    console.log("메인화면으로 돌아가기");
    returnToInsert();
  }
}

function returnToSelection() {
  const gameControls = document.getElementById("game-controls");
  gameControls.classList.add("hide");
  const game = document.getElementById("game");
  if (game) {
    game.remove(); // 게임 뷰 요소 삭제
  }

  document.removeEventListener("keydown", handleMenuKeyPress);
  document.removeEventListener("keydown", handleKeyPress);
  document.removeEventListener("keydown", handlePKeyPress);
  // 게임 선택 화면 보이기
  const gameSelection = document.getElementById("content");
  resetAnimation(gameSelection); // 부드러운 전환 효과 적용
  mainBgm.play();
  gameSelection.innerHTML = `
    <div id="game-selection">
      <p id="selected-game">← Tetris →</p>
      <p>Press Enter to start selected game</p>
  </div>
                `;
  GlobalState.isGameActive = false;
}

let countdownInterval; // 전역 변수로 선언하여 clearInterval을 통해 중단 가능하도록 함
let countdown;

function returnToInsert() {
  const gameControls = document.getElementById("game-controls");
  gameControls.classList.add("hide");
  const game = document.getElementById("game");
  if (game) {
    game.remove(); // 게임 뷰 요소 삭제
  }

  console.log("coin:" + coin);
  if (coin == 0) {
    let count = 10;
    countdown = document.createElement("div"); // 전역 변수 countdown에 할당
    countdown.id = "count-down";
    countdown.textContent = count;
    countdown.style.display = "block";
    console.log(countdown.style.display);

    countdownInterval = setInterval(() => {
      count--;
      console.log(count);
      countdown.textContent = count;
      if (count === 0) {
        clearInterval(countdownInterval);
        // 10초 카운트가 끝나면 아래 코드 실행

        // 화면 조정
        mainPage.style.transform = "scale(1)"; // 줌 아웃
        mainPage.style.transition = ".5s";

        gameStartDisplay.style.display = "block";

        // 게임 선택 화면 보이기
        const gameSelection = document.getElementById("content");
        mainBgm.play();
        gameSelection.innerHTML = `
        <div id="game-selection">
          <p id="selected-game">← Tetris →</p>
          <p>Press Enter to start selected game</p>
        </div>
      `;

        GlobalState.isGameActive = false;
      } else {
        // 카운트 다운 중에는 어둡게 처리
        darkenGameContent();
      }
    }, 1000);
    const content = document.getElementById("content");
    content.appendChild(countdown);
  } else {
    countdown.style.display = "none";
    clearDarkenGameContent();
  }
}

document.addEventListener("keydown", handleInsertKeyPress);

function handleInsertKeyPress(event) {
  if (event.key === "Insert") {
    coin++; // 코인 증가
    insertCoin.play();
    console.log("코인: " + coin);

    GlobalState.isGameActive = false; // 게임 종료 상태로 설정
    clearInterval(countdownInterval); // 카운트 다운 인터벌 중지

    // 카운트 다운 화면 제거
    countdown.remove();
    countdown.style.display = "none";
    restartGame();
    clearDarkenGameContent();
  }
}

function selectThreeButton(direction) {
  const gameControls = document.getElementById("game-controls");
  const buttons = gameControls.querySelectorAll("button");
  buttonIndex = (buttonIndex + direction + buttons.length) % buttons.length;
  buttons.forEach((button, index) => {
    if (index === buttonIndex) {
      button.classList.add("selected");
      console.log(button.classList);
    } else {
      button.classList.remove("selected");
    }
  });

  return buttons;
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
                    <h2 style="margin-bottom:10px;">HIGH SCORES</h2>
                    <ol id="highScores"></ol>
                    <br><br>
                    <span>Coin: </span>
                    <span id="tetris-coin" class="tetris-coin">${coin}</span>
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
                      <button id="restartButton" class="control-button"  onclick="restartGame()">game restart</button>
                      <button id="returnButton" class="control-button" onclick="returnToSelection()">game select</button>
                    </div>
                    <div id="nickname-screen" class="screen">
                    <form id="nickname-form">
                    <label for="nickname">Enter your nickname:</label>
                    <input type="text" id="nickname" name="nickname">
                    <button type="submit">Submit</button>
                    </form>
                    </div>
                    <div class="leaderboard-container">
                      <h1>Ranking</h1>
                      <ol id="leaderboard-list"></ol>
                      <div class="button-row">
                      <button id="game-again-button" class="gameButton">Game Again</button>
                      <button id="game-select-button" class="gameButton">Game Select</button>
                      </div>
                    </div>
                    <div id="count-down">1</div>

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

function darkenGameContent() {
  const leftColumn = document.querySelector("#content > .grid > .left-column");
  const rightColumn = document.querySelector(
    "#content > .grid > .right-column"
  );
  leftColumn.style.filter = "brightness(0.5)";
  rightColumn.style.filter = "brightness(0.5)";
}

function clearDarkenGameContent() {
  const leftColumn = document.querySelector("#content > .grid > .left-column");
  const rightColumn = document.querySelector(
    "#content > .grid > .right-column"
  );
  leftColumn.style.filter = "";
  rightColumn.style.filter = "";
}

