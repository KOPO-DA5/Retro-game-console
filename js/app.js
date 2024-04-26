(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const gameState = {
      currentGame: "Tetris",
      scriptLoaded: false,
      scriptElement: null,
    };

    function handleKeyDownApp(event) {
      console.log("2. app.js 게임선택 리스너", event.code);

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        toggleGameSelection();
      }
      if (event.key === "Enter") {
        loadSelectedGame(gameState.currentGame);
      }
    }

    // 처음에만 기본 이벤트 리스너 등록
    document.addEventListener("keydown", handleKeyDownApp);

    function toggleGameSelection() {
      gameState.currentGame =
        gameState.currentGame === "Tetris" ? "Dino" : "Tetris";
      var displayGame =
        gameState.currentGame === "Tetris" ? "← Tetris →" : "← Dino →";
      document.getElementById("selected-game").textContent = displayGame;
    }

    function loadSelectedGame(game) {
      // 현재 게임의 이벤트 리스너를 제거
      document.removeEventListener("keydown", handleKeyDownApp);

      if (gameState.scriptElement) {
        document.body.removeChild(gameState.scriptElement);
        gameState.scriptElement = null;
      }

      let scriptPath =
        game === "Tetris" ? "./js/tetris.js" : "./js/dinosaur.js";
      let script = document.createElement("script");
      script.src = scriptPath;
      script.onload = function () {
        // 각 게임 스크립트 로드 완료 후 처리 로직
        if (game === "Tetris") {
          loadGameTetris();
        } else {
          loadGameDino();
        }
        // 게임 스크립트 로딩 후 다시 기본 이벤트 리스너 등록
        document.addEventListener("keydown", handleKeyDownApp);
      };
      document.body.appendChild(script);
      gameState.scriptElement = script;
    }
  });
})();
