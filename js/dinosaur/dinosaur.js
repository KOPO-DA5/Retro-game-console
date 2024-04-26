//dinosaur.js
function loadGameDino() {
  console.log(globalSelectedCharacter); // 선택된 캐릭터 확인
  const content = document.getElementById('content');

  var newStyle = document.createElement('link');
  newStyle.setAttribute('rel', 'stylesheet');

  resetAnimation(content); // 애니메이션 초기화
  updateGameContent(); // 콘텐츠 업데이트

  // 애니메이션 시작
  content.classList.add('fade-in');
}

function resetAnimation(element) {
  element.classList.remove('fade-in');
  void element.offsetWidth; // DOM 리플로우 강제 실행으로 CSS 애니메이션 리셋
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
  // 기존에 로드된 동일한 스크립트 파일을 찾아 제거합니다.
  const existingScript = document.querySelector(`script[src="${src}"]`);
  if (existingScript) {
    existingScript.remove();
  }

  // 새 스크립트 요소를 생성하고, 페이지에 추가합니다.
  let script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.async = false; // 스크립트 로딩 순서를 보장합니다.
  document.body.appendChild(script);
}
