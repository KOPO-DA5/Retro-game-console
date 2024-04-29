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

function updateGameContent() {
  const content = document.getElementById("content");
  content.innerHTML = `
  <link rel="stylesheet" href="./css/tetris.css" />
  <div class="grid">
    <div class="left-column">
      <h2 style="margin-bottom: 10px">HIGH SCORES</h2>
      <ol id="highScores"></ol>
      <br /><br />
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
      <button id="pause-btn" onclick="pause()" class="play-button">
        Pause
      </button>
    </div>
   
    <div id="count-down">1</div>
  </div>
  <div id="game-controls" class="game-controls hide">
      <button id="resumeButton" class="control-button" onclick="resumeGame()">
        game resume
      </button>
      <button
        id="restartButton"
        class="control-button"
        onclick="restartGame()"
      >
        game restart
      </button>
      <button
        id="returnButton"
        class="control-button"
        onclick="returnToSelection()"
      >
        game select
      </button>
    </div>
    <div id="nickname-screen" class="screen">
      <form id="nickname-form">
        <label for="nickname">Enter your nickname:</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          placeholder="your name"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
    <div class="leaderboard-container">
      <h1>Ranking</h1>
      <ol id="leaderboard-list"></ol>
      <div class="button-row">
        <button id="game-again-button" class="gameButton">Game Again</button>
        <button id="game-select-button" class="gameButton">
          Game Select
        </button>
      </div>
    </div>
            `;

  // let scriptToConstants = document.createElement("script");
  // scriptToConstants.type = "text/javascript";
  // scriptToConstants.src = "./js/tetris/constants.js";
  // document.body.appendChild(scriptToConstants);
  loadScript("js/tetris/constants.js");

  // let scriptToBoard = document.createElement("script");
  // scriptToBoard.type = "text/javascript";
  // scriptToBoard.src = "./js/tetris/board.js";
  // document.body.appendChild(scriptToBoard);
  loadScript("js/tetris/board.js");

  // let scriptToPiece = document.createElement("script");
  // scriptToPiece.type = "text/javascript";
  // scriptToPiece.src = "./js/tetris/piece.js";
  // document.body.appendChild(scriptToPiece);
  loadScript("js/tetris/piece.js");

  // let scriptTomain = document.createElement("script");
  // scriptTomain.type = "text/javascript";
  // scriptTomain.src = "./js/tetris/main.js";
  // document.body.appendChild(scriptTomain);
  loadScript("js/tetris/main.js");

  // let scriptTosound = document.createElement("script");
  // scriptTosound.type = "text/javascript";
  // scriptTosound.src = "./js/tetris/sound.js";
  // document.body.appendChild(scriptTosound);
  loadScript("js/tetris/sound.js");
}

function loadScript(src) {
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (existingScript) {
    existingScript.remove();
  }

  let script = document.createElement("script");
  script.src = src;
  script.type = "text/javascript";
  script.async = false;
  document.body.appendChild(script);
}
