// app.js
document.addEventListener("DOMContentLoaded", function () {
  var currentGame = "Tetris"; // 기본 선택 게임

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      // 화살표 키로 게임 선택
      toggleGameSelection();
    }
    if (event.key === "Enter") {
      // Enter 키로 게임 시작
      loadSelectedGame(currentGame);
    }
  });

  function toggleGameSelection() {
    currentGame = currentGame === "Tetris" ? "Dino" : "Tetris";
    var displayGame = currentGame === "Tetris" ? "← Tetris →" : "← Dino →";
    document.getElementById("selected-game").textContent = displayGame;
  }

  function loadSelectedGame(game) {
    let script = document.createElement("script");
    script.onload = function () {
      if (game === "Tetris") {
        loadGameTetris();
      } else {
        loadGameDino();
      }
    };
    document.body.appendChild(script);
  }
});

function loadScriptAndGame(scriptPath) {
  var script = document.createElement("script");
  script.src = scriptPath;
  script.onload = function () {
    // 스크립트 파일이 로드되면 해당하는 게임 함수 호출
    if (scriptPath === "./js/tetris.js") {
      loadGameTetris();
    } else if (scriptPath === "./js/dinosaur.js") {
      loadGameDino();
    }
  };
  document.body.appendChild(script);
}
