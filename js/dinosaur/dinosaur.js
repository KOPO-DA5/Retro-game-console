function loadGameDino() {
  console.log(globalSelectedCharacter);
  const content = document.getElementById("content");

  var newStyle = document.createElement("link");
  newStyle.setAttribute("rel", "stylesheet");

  resetAnimation(content);
  updateGameContent();
}

function resetAnimation(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth;
  element.classList.add("fade-in");
}

function pauseMusic(soundId) {
  const backgroundMusic = document.getElementById(soundId);
  backgroundMusic.pause();
}

function updateGameContent() {
  pauseMusic("mainBgm");
  const content = document.getElementById("content");
  content.innerHTML = `
  <link rel="stylesheet" href="css/dinosaur.css" />
  <audio id="jumpSound" src="audios/dino/dino-jump.mp3"></audio>
  <audio
    id="backgroundMusic"
    src="audios/dino/dino-background.mp3"
    loop
  ></audio>
  <audio id="menuMoveSound" src="audios/else/esc-move.mp3"></audio>
  <audio id="pauseSound" src="audios/else/esc-on.mp3"></audio>
  <audio id="gameOverSound" src="audios/dino/dino-gameover.mp3"></audio>
  <audio
    id="obstacleHitSound"
    src="audios/dino/dino-hitobstacle.mp3"
  ></audio>
  <audio
    id="insertCoin"
    src="audios/else/insert-coin.mp3"
  ></audio>
  <div id="game" class="game hide">
    <br>
    <spa style="font-size: 12px">Coin: </spa>
    <span style="font-size: 12px" id="coin" class="coin">${coin}</span>
    <div style="font-size: 12px" id="score" class="score">0</div>
    <div id="start-message" class="start-message">Press any key to start</div>
    <img src="images/dinosaur/ground.png" class="ground" />
    <img src="images/dinosaur/ground.png" class="ground" />
    <img
      src="images/dinosaur/${globalSelectedCharacter}/${globalSelectedCharacter}-stationary.png"
      id="dino"
      class="dino"
    />
    <div id="gameover-message" class="gameover-message hide">
      <p>Game over</p>
      <span>Press any key to restart</span>
    </div>
  </div>
  <div id="game-controls" class="game-controls hide">
    <button id="resumeButton" class="control-button-dino" onclick="resumeGame()">
      game resume
    </button>
    <button id="restartButton" class="control-button-dino" onclick="restartGame()">
      game restart
    </button>
    <button
      id="returnButton"
      class="control-button-dino"
      onclick="returnToSelection()"
    >
      game select
    </button>
  </div>
  <div id="ranking-modal" class="ranking-modal hide">
    <h2 id="topScore-label">Top Scores</h2>
    <ol id="dinoHighScores">
      <!-- 여기에 점수를 동적으로 추가-->
    </ol>
    <div class="rank-modal-button">
      <button
        id="playAgainButton"
        class="modal-button"
        onclick="restartGame()"
      >
        Play Again
      </button>
      <button
        id="backToGameSelectionButton"
        class="modal-button"
        onclick="returnToSelection()"
      >
        Game Select
      </button>
    </div>
  </div>
  <div id="nameInputModal" class="name-entry-modal hide">
    <div class="modal-content">
      <h2 id="nameLabel">Enter Your Name</h2>
      <input type="text" id="playerNameInput" placeholder="Your name" />
      <button id="submitScoreButton" class="modal-button-name">
        Press Enter!!
      </button>
    </div>
  </div>

  <div id="count-down" class="count-down hide">
    <p id="count-number">0</p>
  </div>

              `;

  loadScript("js/dinosaur/main.js");
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
