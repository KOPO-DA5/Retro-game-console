// app.js
document.addEventListener("DOMContentLoaded", function () {
  var currentGame = "Tetris"; // 기본 선택 게임

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      toggleGameSelection();
    }
    if (event.key === "Enter") {
      loadSelectedGame(currentGame);
    }
  });

  function toggleGameSelection() {
    currentGame = currentGame === "Tetris" ? "Dino" : "Tetris";
    var displayGame = currentGame === "Tetris" ? "← Tetris →" : "← Dino →";
    document.getElementById("selected-game").textContent = displayGame;
  }

  function loadSelectedGame(game) {
    removeGameSelection(); // 게임 선택 UI 삭제
    let scriptPath = game === "Tetris" ? "./js/tetris.js" : "./js/dinosaur.js";
    let script = document.createElement("script");
    script.src = scriptPath;
    script.onload = function () {
      if (game === "Tetris") {
        loadGameTetris();
      } else {
        loadGameDino();
      }
    };
    document.body.appendChild(script);
  }

  function hideGameSelection() {
    document.getElementById("game-selection").style.display = "none";
  }

  function removeGameSelection() {
    document.getElementById("game-selection").remove();
  }
});
