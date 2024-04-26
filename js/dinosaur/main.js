(function () {
  console.log(globalSelectedCharacter);
  const SPEED_SCALE = 0.00001;

  const game = document.querySelector('#game');
  const scoreDisplay = document.querySelector('#score');
  const startMessage = document.querySelector('#start-message');
  const gameoverMessage = document.querySelector('#gameover-message');
  const gameControls = document.getElementById('game-controls');
  const buttons = gameControls.querySelectorAll('button');

  document.addEventListener('keydown', startGame, { once: true });
  let lastTime;
  let speedScale;
  let score;
  let isPaused = false;
  let selectedButtonIndex = 0;

  // 명명된 함수 정의

  // 이벤트 리스너 추가
  document.addEventListener('keydown', handleKeyDown);

  function pauseGame() {
    isPaused = true;
    gameControls.classList.remove('hide');
    selectButton(0); // 초기 선택된 버튼 설정
    pauseBackgroundMusic();
  }

  function resumeGame() {
    isPaused = false;
    gameControls.classList.add('hide');
    lastTime = null;
    resumeBackgroundMusic();
    window.requestAnimationFrame(update);
  }

  function restartGame() {
    setupGame();
    playBackgroundMusic();
    resumeGame();
  }

  function returnToSelection() {
    document.getElementById('game-controls').classList.add('hide'); // 게임 컨트롤 숨기기
    gameoverMessage.classList.add('hide'); // 게임 오버 메시지 숨기기
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keydown', onJump);
    // 게임 뷰의 요소를 삭제
    const game = document.getElementById('game');
    if (game) {
      game.remove(); // 게임 뷰 요소 삭제
    }

    // 게임 선택 화면 보이기
    const gameSelection = document.getElementById('content');
    gameSelection.innerHTML = `
    <div id="game-selection">
      <p id="selected-game">← Tetris →</p>
      <p>Press Enter to start selected game</p>
  </div>
                `;
  }

  window.returnToSelection = returnToSelection;
  window.restartGame = restartGame;
  window.resumeGame = resumeGame;
  window.setupGame = setupGame;

  function setupGame() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupDino();
    setupCactus();
    window.requestAnimationFrame(update);
  }

  function selectButton(direction) {
    selectedButtonIndex = (selectedButtonIndex + direction + buttons.length) % buttons.length;
    buttons.forEach((button, index) => {
      if (index === selectedButtonIndex) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }

  function handleKeyDown(event) {
    console.log('3.main.js addEventListener', event.target);
    event.stopPropagation(); // 이벤트 버블링 중단

    switch (event.code) {
      case 'Escape':
        if (!isPaused) {
          pauseGame();
          playSound('pauseSound');
        } else {
          resumeGame();
        }
        break;
      case 'ArrowUp':
        if (isPaused) {
          selectButton(-1);
          playSound('menuMoveSound');
        }
        break;
      case 'ArrowDown':
        if (isPaused) {
          selectButton(1);
          playSound('menuMoveSound');
        }
        break;
      case 'Space':
        if (isPaused) {
          event.preventDefault(); // 스페이스바 기본 동작 방지
          buttons[selectedButtonIndex].click();
        }
        break;
    }
  }

  /* frame update */
  function update(time) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지

    if (lastTime == null) {
      lastTime = time;
      window.requestAnimationFrame(update);
      return;
    }

    const delta = time - lastTime;

    if (!isPaused) {
      // 일시정지가 아닐 때만 게임 로직 업데이트
      updateGround(delta, speedScale);
      updateDino(delta, speedScale);
      updateCactus(delta, speedScale);
      updateSpeedScale(delta);
      updateScore(delta);
    }

    if (checkGameOver()) {
      pauseBackgroundMusic();
      playSound('obstacleHitSound');
      return handleGameOver();
    }

    lastTime = time;
    window.requestAnimationFrame(update);
  }

  function startGame() {
    isGameOver = false;

    playBackgroundMusic();

    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupDino();
    setupCactus();
    startMessage.classList.add('hide');
    gameoverMessage.classList.add('hide');
    window.requestAnimationFrame(update);
  }

  /* speeds up the game over time */
  function updateSpeedScale(delta) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지
    speedScale += delta * SPEED_SCALE;
  }

  function updateScore(delta) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지

    score += delta * 0.01;
    scoreDisplay.textContent = Math.floor(score);
  }

  /* collision conditions */
  function checkCollision(rect1, rect2, padding) {
    // 여유 공간(padding)을 적용하여 충돌 감지
    return (
      rect1.left < rect2.right - padding &&
      rect1.top < rect2.bottom - padding &&
      rect1.right > rect2.left + padding &&
      rect1.bottom > rect2.top + padding
    );
  }

  function checkGameOver() {
    const dinoRect = getDinoRect();
    const cactusRects = getCactusRects();

    // 여유 공간 설정 (예: 10 픽셀)
    const padding = 10;

    return cactusRects.some((rect) => checkCollision(rect, dinoRect, padding));
  }

  function handleGameOver() {
    setDinoLose();
    setTimeout(() => {
      document.addEventListener('keydown', startGame, {
        once: true,
      }); /* prevents accidental click */
      gameoverMessage.classList.remove('hide');
    }, 100);

    playSound('gameOverSound');
  }

  /* HANDLING CSS PROPERTIES */

  /* get property value */
  function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
  }

  /* set property value */
  function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value);
  }

  /* increment the property value */
  function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
  }

  /* GROUND MOVEMENT */

  const GROUND_SPEED = 0.05;
  const grounds = document.querySelectorAll('.ground');

  function setupGround() {
    setCustomProperty(grounds[0], '--left', 0);
    setCustomProperty(grounds[1], '--left', 300);
  }

  function updateGround(delta, speedScale) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지

    grounds.forEach((ground) => {
      incrementCustomProperty(
        ground,
        '--left',
        delta * speedScale * GROUND_SPEED * -1
      ); /* moves the ground according to game speed */

      if (getCustomProperty(ground, '--left') <= -300) {
        incrementCustomProperty(ground, '--left', 600); /* loop the elements */
      }
    });
  }

  /* DINOSAUR MOVEMENT */

  const dino = document.querySelector('#dino');
  const JUMP_SPEED = 0.45;
  const GRAVITY = 0.0015;
  const DINO_FRAME_COUNT = 3;
  const FRAME_TIME = 100;

  let isJumping;
  let dinoFrame;
  let currentFrameTime;
  let yVelocity;

  function setupDino() {
    isJumping = false;
    dinoFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;

    setCustomProperty(dino, '--bottom', 0);
    document.removeEventListener('keydown', onJump); /* reset the dinosaur if the player dies while jumping */
    document.addEventListener('keydown', onJump);
  }

  function updateDino(delta, speedScale) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지

    handleRun(delta, speedScale);
    handleJump(delta);
  }

  function getDinoRect() {
    return dino.getBoundingClientRect(); /* get the dinosaur hitbox */
  }

  function setDinoLose() {
    dino.src = `../images/dinosaur/${globalSelectedCharacter}/${globalSelectedCharacter}-lose.png`;
  }

  function handleRun(delta, speedScale) {
    if (isJumping) {
      dino.src = `../images/dinosaur/${globalSelectedCharacter}/${globalSelectedCharacter}-jump.png`;
      return;
    }

    if (currentFrameTime >= FRAME_TIME) {
      dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
      dino.src = `../images/dinosaur/${globalSelectedCharacter}/${globalSelectedCharacter}-run-${dinoFrame}.png`; /* switch between images to simulate movement */
      currentFrameTime -= FRAME_TIME;
    }
    currentFrameTime += delta * speedScale;
  }

  function handleJump(delta) {
    if (!isJumping) return;

    incrementCustomProperty(dino, '--bottom', yVelocity * delta);

    if (getCustomProperty(dino, '--bottom') <= 0) {
      setCustomProperty(dino, '--bottom', 0);
      isJumping = false;
    }

    yVelocity -= GRAVITY * delta;
  }

  function onJump(e) {
    e.preventDefault(); // 스페이스바 기본 동작 방지
    e.stopPropagation(); // 이벤트 버블링 중단

    console.log('3. main.js onJump', e.target);
    if (e.code !== 'Space' || isJumping) return;

    yVelocity = JUMP_SPEED;
    isJumping = true;

    if (!isPaused) {
      playSound('jumpSound');
    }
  }

  /* ADD CACTUS */

  const CACTUS_SPEED = 0.05;
  const CACTUS_INTERVAL_MIN = 500;
  const CACTUS_INTERVAL_MAX = 2000;

  let nextCactusTime;

  function setupCactus() {
    nextCactusTime = CACTUS_INTERVAL_MIN;
    document.querySelectorAll('.cactus').forEach((cactus) => {
      cactus.remove(); /* remove cactus when game restart */
    });
  }

  function updateCactus(delta, speedScale) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지

    document.querySelectorAll('.cactus').forEach((cactus) => {
      incrementCustomProperty(cactus, '--left', delta * speedScale * CACTUS_SPEED * -1);
      if (getCustomProperty(cactus, '--left') <= -100) {
        cactus.remove(); /* remove cactus off screen so it doesn't impair game performance */
      }
    });

    if (nextCactusTime <= 0) {
      createCactus();
      nextCactusTime = randomizer(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale;
    }
    nextCactusTime -= delta;
  }

  function getCactusRects() {
    return [...document.querySelectorAll('.cactus')].map((cactus) => {
      return cactus.getBoundingClientRect(); /* get the hitbox of all the cactus on the screen */
    });
  }

  function createCactus() {
    const cactus = document.createElement('img');
    cactus.src = '../images/dinosaur/cactus.png';
    cactus.classList.add('cactus');
    setCustomProperty(cactus, '--left', 100);
    game.append(cactus);
  }

  function randomizer(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min); /* choose a number between minimum and maximum */
  }

  /* ADD AUDIO */

  function playBackgroundMusic() {
    if (!isGameOver) {
      const backgroundMusic = document.getElementById('backgroundMusic');
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
    }
  }

  function resumeBackgroundMusic() {
    if (!isGameOver) {
      const backgroundMusic = document.getElementById('backgroundMusic');
      backgroundMusic.play();
    }
  }

  function pauseBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.pause();
  }

  function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
  }
})();
