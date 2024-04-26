function loadGameDino() {
  console.log(globalSelectedCharacter);
  const content = document.getElementById('content');

  var newStyle = document.createElement('link');
  newStyle.setAttribute('rel', 'stylesheet');

  resetAnimation(content);
  updateGameContent();

  content.classList.add('fade-in');
}

function resetAnimation(element) {
  element.classList.remove('fade-in');
  void element.offsetWidth;
  element.classList.add('fade-in');
}

function updateGameContent() {
  const content = document.getElementById('content');
  content.innerHTML = `
          <link rel="stylesheet" href="../css/dinosaur.css" />
          <audio id="jumpSound" src="../audios/dino/dino-jump.mp3"></audio>
          <audio id="backgroundMusic" src="../audios/dino/dino-background.mp3" loop></audio>
          <audio id="menuMoveSound" src="../audios/else/esc-move.mp3"></audio>
          <audio id="pauseSound" src="../audios/else/esc-on.mp3"></audio>
          <audio id="gameOverSound" src="../audios/dino/dino-gameover.mp3"></audio>
          <audio id="obstacleHitSound" src="../audios/dino/dino-hitobstacle.mp3"></audio>
          <div id="game" class="game">
            <div id="score" class="score">0</div>
            <div id="start-message" class="start-message">Press any key to start</div>
            <img src="../images/dinosaur/ground.png" class="ground" />
            <img src="../images/dinosaur/ground.png" class="ground" />
            <img src="../images/dinosaur/${globalSelectedCharacter}/${globalSelectedCharacter}-stationary.png" id="dino" class="dino" />
            <div id="gameover-message" class="gameover-message hide">
              <p>Game over</p>
              <span>Press any key to restart</span>
            </div>
            <div id="game-controls" class="game-controls hide">
              <button id="resumeButton" class="control-button" onclick="resumeGame()">game resume</button>
              <button id="restartButton" class="control-button" onclick="restartGame()">game restart</button>
              <button id="returnButton" class="control-button" onclick="returnToSelection()">game select</button>
            </div>
          </div>
              `;

  loadScript('../js/dinosaur/main.js');
}

function loadScript(src) {
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (existingScript) {
    existingScript.remove();
  }

  let script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.async = false;
  document.body.appendChild(script);
}
