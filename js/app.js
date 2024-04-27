document.addEventListener("DOMContentLoaded", function () {
  function handleKeyDownApp(event) {
    if (!GlobalState.isGameActive) {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        toggleGameSelection();
      }
      if (event.key === "Enter") {
        loadSelectedGame(GlobalState.currentGame);
      }
    }
  }

  // 게임 선택 이벤트 리스너 등록
  document.addEventListener("keydown", handleKeyDownApp);

  function toggleGameSelection() {
    if (!GlobalState.isGameActive) {
      GlobalState.currentGame =
        GlobalState.currentGame === "Tetris" ? "Dino" : "Tetris";
      var displayGame =
        GlobalState.currentGame === "Tetris" ? "← Tetris →" : "← Dino →";
      document.getElementById("selected-game").textContent = displayGame;
    }
  }

  function loadSelectedGame(game) {
    GlobalState.isGameActive = true;
    if (GlobalState.scriptElement) {
      document.body.removeChild(GlobalState.scriptElement);
    }

    let scriptPath =
      game === "Tetris" ? "./js/tetris.js" : "./js/dinosaur/skin.js";
    let script = document.createElement("script");
    script.src = scriptPath;
    script.onload = function () {
      if (game === "Tetris") {
        loadGameTetris();
      } else {
        loadGameSkin();
      }
    };
    document.body.appendChild(script);
    GlobalState.scriptElement = script;
  }
});
