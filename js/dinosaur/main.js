// import { gameState } from "../gameState.js";
(function () {
  const SPEED_SCALE = 0.00001;

  const game = document.querySelector("#game");
  const scoreDisplay = document.querySelector("#score");
  const startMessage = document.querySelector("#start-message");
  const gameoverMessage = document.querySelector("#gameover-message");
  const gameControls = document.getElementById("game-controls");
  const buttons = gameControls.querySelectorAll("button");
  let dinoAccountValues = {
    score: 0,
    lines: 0,
    level: 0,
  };

  document.addEventListener("keydown", startGame, { once: true });

  let account = new Proxy(dinoAccountValues, {
    set: (target, key, value) => {
      target[key] = value;
      updateAccount(key, value);
      return true;
    },
  });

  function updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
      element.textContent = value;
    }
  }

  let lastTime;
  let speedScale;
  let isPaused = false;
  let selectedButtonIndex = 0;
  let isGameOver = false;
  let score = 0;

  // 명명된 함수 정의

  // 이벤트 리스너 추가

  function pauseGame() {
    isPaused = true;
    gameControls.classList.remove("hide");
    selectButton(0); // 초기 선택된 버튼 설정
    pauseBackgroundMusic();
  }

  function resumeGame() {
    isPaused = false;
    gameControls.classList.add("hide");
    lastTime = null;
    resumeBackgroundMusic();
    window.requestAnimationFrame(update);
  }

  function restartGame() {
    setupGame();
    playBackgroundMusic();
    resumeGame();
    document.addEventListener("keydown", handleKeyDown);
    document.removeEventListener("keydown", modalButtonSelection);
  }

  function returnToSelection() {
    document.getElementById("game-controls").classList.add("hide"); // 게임 컨트롤 숨기기
    gameoverMessage.classList.add("hide"); // 게임 오버 메시지 숨기기
    //공룡게임에서 사용했던 모든 이벤트리스너 제거
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keydown", onJump);
    document.removeEventListener("keydown", modalButtonSelection);

    // 게임 뷰의 요소를 삭제
    const game = document.getElementById("game");
    if (game) {
      game.remove();
    }

    // 게임 선택 화면 보이기
    const gameSelection = document.getElementById("content");
    resetAnimation(gameSelection); // 부드러운 전환 효과 적용
    playSound("mainBgm");
    gameSelection.innerHTML = `
    <div id="game-selection">
      <p id="selected-game">← Dino →</p>
      <p>Press Enter to start selected game</p>
  </div>
                `;
    GlobalState.isGameActive = false; //전역으로 게임이 종료되었음을 알림 -> 게임선택 이벤트 리스너가 다시 동작함
  }

  function resetAnimation(element) {
    element.classList.remove("fade-in");
    void element.offsetWidth;
    element.classList.add("fade-in");
  }

  window.returnToSelection = returnToSelection;
  window.restartGame = restartGame;
  window.resumeGame = resumeGame;
  window.setupGame = setupGame;

  function setupGame() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    account.score = 0;
    setupGround();
    setupDino();
    setupCactus();
    window.requestAnimationFrame(update);
    document.getElementById("ranking-modal").classList.add("hide"); // 게임 컨트롤 숨기기
    document.removeEventListener("keydown", modalButtonSelection);
  }

  function selectButton(direction) {
    selectedButtonIndex =
      (selectedButtonIndex + direction + buttons.length) % buttons.length;
    buttons.forEach((button, index) => {
      if (index === selectedButtonIndex) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
        ``;
      }
    });
  }

  function handleKeyDown(event) {
    console.log("3.main.js 공룡게임 일시정지 리스너", event.target);
    event.stopPropagation(); // 이벤트 버블링 중단

    switch (event.code) {
      case "Escape":
        if (!isPaused) {
          pauseGame();
          playSound("pauseSound");
        } else {
          resumeGame();
        }
        break;
      case "ArrowUp":
        if (isPaused) {
          selectButton(-1);
          playSound("menuMoveSound");
        }
        break;
      case "ArrowDown":
        if (isPaused) {
          selectButton(1);
          playSound("menuMoveSound");
        }
        break;
      case "Enter":
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
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", onJump);
      pauseBackgroundMusic();
      playSound("obstacleHitSound");
      checkHighScore(account.score);
      return handleGameOver();
    }

    lastTime = time;
    window.requestAnimationFrame(update);
  }

  function startGame() {
    isGameOver = false;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", onJump);
    document.getElementById("ranking-modal").classList.add("hide"); // 게임 컨트롤 숨기기

    playBackgroundMusic();

    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupDino();
    setupCactus();
    startMessage.classList.add("hide");
    gameoverMessage.classList.add("hide");
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
    account.score += delta * 0.01;
    scoreDisplay.textContent = Math.floor(account.score);
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
    // setTimeout(() => {
    //   document.addEventListener("keydown", startGame, {
    //     once: true,
    //   }); /* prevents accidental click */
    //   gameoverMessage.classList.remove("hide");
    // }, 100);

    playSound("gameOverSound");
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
  const grounds = document.querySelectorAll(".ground");

  function setupGround() {
    setCustomProperty(grounds[0], "--left", 0);
    setCustomProperty(grounds[1], "--left", 300);
  }

  function updateGround(delta, speedScale) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지

    grounds.forEach((ground) => {
      incrementCustomProperty(
        ground,
        "--left",
        delta * speedScale * GROUND_SPEED * -1
      ); /* moves the ground according to game speed */

      if (getCustomProperty(ground, "--left") <= -300) {
        incrementCustomProperty(ground, "--left", 600); /* loop the elements */
      }
    });
  }

  /* DINOSAUR MOVEMENT */

  const dino = document.querySelector("#dino");
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

    setCustomProperty(dino, "--bottom", 0);
    document.removeEventListener(
      "keydown",
      onJump
    ); /* reset the dinosaur if the player dies while jumping */
    document.addEventListener("keydown", onJump);
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

    incrementCustomProperty(dino, "--bottom", yVelocity * delta);

    if (getCustomProperty(dino, "--bottom") <= 0) {
      setCustomProperty(dino, "--bottom", 0);
      isJumping = false;
    }

    yVelocity -= GRAVITY * delta;
  }

  function onJump(e) {
    e.preventDefault(); // 스페이스바 기본 동작 방지
    e.stopPropagation(); // 이벤트 버블링 중단

    console.log("3. main.js 공룡게임 onJump", e.target);
    if (e.code !== "Space" || isJumping) return;

    yVelocity = JUMP_SPEED;
    isJumping = true;

    if (!isPaused) {
      playSound("jumpSound");
    }
  }

  /* ADD CACTUS */

  const CACTUS_SPEED = 0.05;
  const CACTUS_INTERVAL_MIN = 500;
  const CACTUS_INTERVAL_MAX = 2000;

  let nextCactusTime;

  function setupCactus() {
    nextCactusTime = CACTUS_INTERVAL_MIN;
    document.querySelectorAll(".cactus").forEach((cactus) => {
      cactus.remove(); /* remove cactus when game restart */
    });
  }

  function updateCactus(delta, speedScale) {
    if (isPaused) return; // 일시정지 상태일 때 업데이트 중지

    document.querySelectorAll(".cactus").forEach((cactus) => {
      incrementCustomProperty(
        cactus,
        "--left",
        delta * speedScale * CACTUS_SPEED * -1
      );
      if (getCustomProperty(cactus, "--left") <= -100) {
        cactus.remove(); /* remove cactus off screen so it doesn't impair game performance */
      }
    });

    if (nextCactusTime <= 0) {
      createCactus();
      nextCactusTime =
        randomizer(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale;
    }
    nextCactusTime -= delta;
  }

  function getCactusRects() {
    return [...document.querySelectorAll(".cactus")].map((cactus) => {
      return cactus.getBoundingClientRect(); /* get the hitbox of all the cactus on the screen */
    });
  }

  function createCactus() {
    const cactus = document.createElement("img");
    cactus.src = "../images/dinosaur/cactus.png";
    cactus.classList.add("cactus");
    setCustomProperty(cactus, "--left", 100);
    game.append(cactus);
  }

  function randomizer(min, max) {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    ); /* choose a number between minimum and maximum */
  }

  /* ADD AUDIO */

  function playBackgroundMusic() {
    if (!isGameOver) {
      const backgroundMusic = document.getElementById("backgroundMusic");
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
    }
  }

  function resumeBackgroundMusic() {
    if (!isGameOver) {
      const backgroundMusic = document.getElementById("backgroundMusic");
      backgroundMusic.play();
    }
  }

  function pauseBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.pause();
  }

  function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
  }

  // 점수 관련 함수들
  function checkHighScore(score) {
    const modal = document.getElementById("nameInputModal");
    const input = document.getElementById("playerNameInput");
    const button = document.getElementById("submitScoreButton");

    modal.classList.remove("hide"); // 모달 보이기
    input.focus();
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        submitScore();
        input.removeEventListener("keypress", arguments.callee);
      }
    });

    function submitScore() {
      const name = input.value.trim();
      if (name) {
        const highScores =
          JSON.parse(localStorage.getItem("dinoHighScores")) || [];
        const newScore = { score, name };
        saveHighScore(newScore, highScores, true); // 플래그로 새 점수 추가를 표시
        modal.classList.add("hide");
        input.value = "";
      } else {
      }
    }
    button.onclick = submitScore;
  }

  function saveHighScore(score, highScores, isNewScore) {
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(30);
    localStorage.setItem("dinoHighScores", JSON.stringify(highScores));

    // 랭킹 모달을 표시하면서 새로운 점수가 최고 점수인지 전달
    showRankingModal(isNewScore && score.score === highScores[0].score);
  }

  function showRankingModal(isNewTopScore) {
    const modal = document.getElementById("ranking-modal");
    const rankingList = document.getElementById("dinoHighScores");
    const scores = JSON.parse(localStorage.getItem("dinoHighScores")) || [];
    scores.sort((a, b) => b.score - a.score);

    rankingList.innerHTML = "";

    scores.slice(0, 3).forEach((score, index) => {
      const scoreElement = document.createElement("li");
      scoreElement.textContent = `${Math.round(score.score)} - ${score.name}`;
      rankingList.appendChild(scoreElement);
      if (index === 0 && isNewTopScore) {
        scoreElement.classList.add("flash-effect");
      }
    });

    modal.classList.remove("hide");
    document.addEventListener("keydown", modalButtonSelection);
  }

  let modalCurrentButtonIndex = 0;
  const modalButtons = document.querySelectorAll(
    ".rank-modal-button .modal-button"
  ); // 모달 내의 모든 버튼을 선택

  function updateButtonSelection(index) {
    // 모든 버튼의 'selected' 클래스를 제거
    modalButtons.forEach((button) => button.classList.remove("selected"));

    // 현재 선택된 버튼에 'selected' 클래스 추가
    modalButtons[index].classList.add("selected");
  }

  function modalButtonSelection(event) {
    updateButtonSelection(modalCurrentButtonIndex); // 초기 버튼 선택

    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft":
        // 선택된 버튼 인덱스를 감소
        modalCurrentButtonIndex =
          (modalCurrentButtonIndex - 1 + modalButtons.length) %
          modalButtons.length;
        updateButtonSelection(modalCurrentButtonIndex);
        playSound("menuMoveSound");
        break;
      case "ArrowDown":
      case "ArrowRight":
        // 선택된 버튼 인덱스를 증가
        modalCurrentButtonIndex =
          (modalCurrentButtonIndex + 1) % modalButtons.length;
        updateButtonSelection(modalCurrentButtonIndex);
        playSound("menuMoveSound");
        break;
      case "Enter":
        // 선택된 버튼의 클릭 이벤트를 강제 실행
        modalButtons[modalCurrentButtonIndex].click();
        break;
    }
  }
})();
