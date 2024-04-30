// main.js : 테트리스 게임의 실행 로직이 담긴 코드
(function () {
  const canvasBoard = document.getElementById("board");
  const ctxBoard = canvasBoard.getContext("2d");
  const canvasNext = document.getElementById("next");
  const ctxNext = canvasNext.getContext("2d");
  const coinTetris = document.querySelector("#tetris-coin");
  const grid = document.querySelector("#grid");
  grid.classList.remove("hide");

  let buttonIndex = 0;
  let isClickSelectGameBtn = false;

  document.addEventListener("keydown", play, { once: true });
  let accountValues = {
    score: 0,
    lines: 0,
    level: 0,
  };

  //Play 실행 함수
  let board = new Board(ctxBoard, ctxNext);
  board.reset();

  let isPlaying = false;

  initNext();
  showHighScores();

  let requestId;
  // window.requestId = requestId;
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
  }

  function updateCoin() {
    coinTetris.textContent = coin;
  }

  let account = new Proxy(accountValues, {
    set: (target, key, value) => {
      target[key] = value;
      updateAccount(key, value);
      return true;
    },
  });

  let time = {
    start: performance.now(),
    elapsed: 0,
    level: LEVEL[account.level],
  };

  function resetGame() {
    account.score = 0;
    account.lines = 0;
    account.level = 0;
    updateCoin();
    board.clear();
    time = {
      start: performance.now(),
      elapsed: 0,
      level: LEVEL[account.level],
    };
    backgroundSound.currentTime = 0;
    isPlaying = true;

    document.removeEventListener("keydown", addMenuEventListener);
    document.removeEventListener("keydown", handleInsertKeyPress);
    addEventListener();
  }

  function play() {
    GlobalState.currentGame = "Tetris";
    document.removeEventListener("keydown", handleInsertKeyPress);
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
  window.time = time;

  const moves = {
    [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
    [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEY.UP]: (p) => board.rotate(p),
    [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
  };
  window.moves = moves;
  window.account = account;

  function addEventListener() {
    document.removeEventListener("keydown", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
  }

  function removeEventListener() {
    document.removeEventListener("keydown", handleKeyPress);
  }

  function handleKeyPress(event) {
    if (event.keyCode === KEY.P) {
      if (isPlaying) {
        console.log(isPlaying);
        pause();
        sound.pause();
      } else {
        console.log(isPlaying);
        play();
      }
      addEventListener();
    }

    if (event.code === "Escape") {
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
    // console.log(requestId);
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
    console.log("paused 함수 진입", requestId);
    removeEventListener();

    // if (!requestId) {
    //   document.querySelector("#play-btn").style.display = "none";
    //   document.querySelector("#pause-btn").style.display = "block";
    //   animate();
    //   backgroundSound.play();
    //   isPlaying = true;
    //   return;
    // }

    cancelAnimationFrame(requestId);
    // requestId = null;

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
      .map(
        (score) => `<li id="li-marker-tetris">${score.score} - ${score.name}`
      )
      .join("");
  }

  function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    showNicknameScreen();
    const nameInput = document.getElementById("nickname");
    nameInput.value = "";
    nameInput.focus(); // 입력창에 자동으로 포커스를 주기 위함
    function handleNicknameFormSubmit(event) {
      event.preventDefault();
      const name = document.getElementById("nickname").value;
      const newScore = { score, name };
      saveHighScore(newScore, highScores);
      hideNicknameScreen();
      showHighScores();
      leaderboardaddKeyListener();
      showLeaderboard();
    }
    const nicknameForm = document.getElementById("nickname-form");
    nicknameForm.addEventListener("submit", handleNicknameFormSubmit);
  }

  function saveHighScore(score, highScores) {
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

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
    const leaderboardContainer = document.querySelector(
      ".leaderboard-container"
    );
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
      listItem.id = "li_marker";
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

    leaderboardContainer.style.display = "flex"; // leaderboard 보이기

    gameAgainButton.addEventListener("click", () => {
      removeKeyListener();
      resetGame();
      hideLeaderboard();
    });

    removeKeyListener();
  }

  function hideLeaderboard() {
    const leaderboardContainer = document.querySelector(
      ".leaderboard-container"
    );
    leaderboardContainer.style.display = "none"; // leaderboard 숨기기
    removeKeyListener();
  }

  let twobuttonIndex = 0;

  function leaderboardaddKeyListener() {
    const leaderboardContainer = document.querySelector(
      ".leaderboard-container"
    );
    const buttons = leaderboardContainer.querySelectorAll("button");
    twobuttonIndex = 0; // 초기 선택 인덱스를 0으로 설정하여 첫 번째 버튼을 선택
    selectButton(0); // 첫 번째 버튼에 `.select` 클래스 추가

    const keydownHandler = (event) => {
      selectButton(0); // 첫 번째 버튼에 `.select` 클래스 추가

      console.log("3. tetris의 리더보드 이벤트 리스너 실행", event.key);

      if (event.key === "ArrowLeft") {
        selectButton(-1);
        escMove.currentTime = 0;
        escMove.play();
      }
      if (event.key === "ArrowRight") {
        selectButton(1);
        escMove.currentTime = 0;
        escMove.play();
      }
      if (event.key === "Enter") {
        // 여기서 이벤트 리스너를 제거
        removeKeyListener(keydownHandler);
        buttons[buttonIndex].click();
      }
    };
    document.addEventListener("keydown", keydownHandler);
  }

  function selectButton(direction) {
    const leaderboardContainer = document.querySelector(
      ".leaderboard-container"
    );
    const buttons = leaderboardContainer.querySelectorAll("button");
    twobuttonIndex =
      (twobuttonIndex + direction + buttons.length) % buttons.length;
    buttons.forEach((button, index) => {
      button.classList.remove("select");
      if (index === twobuttonIndex) {
        button.classList.add("select");
      }
    });
  }

  function removeKeyListener(keydownEventListener) {
    document.removeEventListener("keydown", keydownEventListener);
  }

  // 분리 후 코드 삽입 부분

  function handleMenuKeyPress(event) {
    if (GlobalState.currentGame === "Tetris") {
      console.log("3. tetris의 일시정지 이벤트 리스너", event.key);
      event.stopPropagation();
      const gameControls = document.getElementById("game-controls");
      if (gameControls) {
        const buttons = gameControls.querySelectorAll("button");
        if (!gameControls.classList.contains("hide")) {
          // if (event.key === "Escape") {
          //   resumeGame();
          // }
          if (event.key === "ArrowUp") {
            selectThreeButton(-1);
            escMove.currentTime = 0;
            escMove.play();
          }
          if (event.key === "ArrowDown") {
            selectThreeButton(1);
            escMove.currentTime = 0;
            escMove.play();
          }
          if (event.key === "Enter") {
            buttons[buttonIndex].click();
          }
        }
      }
    }
  }

  function toggleGamePauseMenu() {
    const gameControls = document.getElementById("game-controls");
    // 게임 컨트롤 보이기/숨기기
    gameControls.classList.toggle("hide");

    if (!GlobalState.isEventListener) {
      addMenuEventListener(); // 항상 이벤트 리스너를 추가
      GlobalState.isEventListener = true;
    }

    if (!gameControls.classList.contains("hide")) {
      pause();
      sound.pause();
    } else {
      play();
    }
  }
  function addMenuEventListener() {
    document.removeEventListener("keydown", handleMenuKeyPress);
    document.addEventListener("keydown", handleMenuKeyPress);
  }

  function resumeGame() {
    const gameControls = document.getElementById("game-controls");
    gameControls.classList.add("hide");
    play();
  }
  window.resumeGame = resumeGame;

  function restartGame() {
    document.removeEventListener("keydown", handleInsertKeyPress);
    if (coin > 0) {
      coin -= 1;
      const gameControls = document.getElementById("game-controls");
      gameControls.classList.add("hide");
      resetGame();
      play();
    } else {
      returnToInsert();
    }
  }
  window.restartGame = restartGame;

  function returnToSelection() {
    isClickSelectGameBtn = true;
    GlobalState.currentGame = null;
    window.GlobalState.currentGame = null;
    const gameControls = document.getElementById("game-controls");
    gameControls.classList.add("hide");
    const game = document.getElementById("game");
    if (game) {
      game.remove(); // 게임 뷰 요소 삭제
    }

    if (coin > 0) {
      document.removeEventListener("keydown", handleMenuKeyPress);
      addEventListener();
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
    } else {
      returnToInsert();
      console.log("테트리스 코인: " + coin);
    }
  }

  window.returnToSelection = returnToSelection;

  let countdownInterval; // 전역 변수로 선언하여 clearInterval을 통해 중단 가능하도록 함
  let countdown;
  window.countdown = countdownInterval;
  window.countdown = countdown;
  function returnToInsert() {
    const gameControls = document.getElementById("game-controls");
    gameControls.classList.add("hide");
    const grid = document.getElementById("grid"); // grid 요소를 가져옴
    grid.classList.add("hide");

    if (coin === 0 && !isClickSelectGameBtn) {
      console.log("코인: " + coin);
      document.addEventListener("keydown", handleInsertKeyPress);
      let count = 10;
      countdown = document.createElement("div"); // 전역 변수 countdown에 할당
      countdown.id = "count-down";
      countdown.style.display = "block";

      countdownInterval = setInterval(() => {
        document.getElementById("count-number").textContent = count;
        countdown.innerHTML = `
        <p>CONTINUE?</p>
        <p id="count-number">${count}</p>
        <p>INSERT COIN</p>
      `;
        count--;
        if (count === -1) {
          GlobalState.currentGame = null;
          clearInterval(countdownInterval);
          // 10초 카운트가 끝나면 아래 코드 실행

          // 화면 조정
          mainPage.style.transform = "scale(1)"; // 줌 아웃
          mainPage.style.transition = ".5s";

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
          countdown.remove();
          countdown.style.display = "none";
        }
      }, 1000);
      const content = document.getElementById("content");
      content.appendChild(countdown);
    } else {
      //countdown.style.display = "none";

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
    }
  }

  document.addEventListener("keydown", handleInsertKeyPress);

  function handleInsertKeyPress(event) {
    console.log("3. tetris의 동전넣기 리스너", event.key);
    if (event.key === "Insert") {
      coin++; // 코인 증가
      insertCoin.play();
      console.log("코인: " + coin);

      GlobalState.isGameActive = false; // 게임 종료 상태로 설정
      clearInterval(countdownInterval); // 카운트 다운 인터벌 중지

      // 카운트 다운 화면 제거
      if (countdown) {
        countdown.remove();
        countdown.style.display = "none";
      }

      const grid = document.getElementById("grid"); // grid 요소를 가져옴
      grid.classList.remove("hide");

      restartGame();
    }
  }

  function selectThreeButton(direction) {
    const gameControls = document.getElementById("game-controls");
    const buttons = gameControls.querySelectorAll("button");
    buttonIndex = (buttonIndex + direction + buttons.length) % buttons.length;
    buttons.forEach((button, index) => {
      if (index === buttonIndex) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });

    return buttons;
  }
})();
