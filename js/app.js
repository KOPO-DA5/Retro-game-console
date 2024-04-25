document.addEventListener("DOMContentLoaded", function (e) {
  const gameState = {
    currentGame: "Tetris",
    scriptLoaded: false,
    scriptElement: null,
  };

  console.log("1. app.js DOMContentLoaded", e.target);

  function handleKeyDownApp(event) {
    console.log("2. app.js handleKeyDownApp", event.code);

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      toggleGameSelection();
    }
    if (event.key === "Enter") {
      loadSelectedGame(gameState.currentGame);
    }
  }
  document.addEventListener("keydown", handleKeyDownApp);

  function toggleGameSelection() {
    gameState.currentGame =
      gameState.currentGame === "Tetris" ? "Dino" : "Tetris";
    var displayGame =
      gameState.currentGame === "Tetris" ? "← Tetris →" : "← Dino →";
    console.log(displayGame);
    document.getElementById("selected-game").textContent = displayGame;
  }

  function loadSelectedGame(game) {
    console.log("app.js + loadSelectedGame");
    console.log(game);
    document.removeEventListener("keydown", handleKeyDownApp);

    if (gameState.scriptElement) {
      document.body.removeChild(gameState.scriptElement);
      gameState.scriptElement = null;
    }

    let scriptPath = game === "Tetris" ? "./js/tetris.js" : "./js/dinosaur.js";
    let script = document.createElement("script");
    script.src = scriptPath;
    script.onload = function () {
      if (game === "Tetris") {
        loadGameTetris();
      } else {
        loadGameDino();
      }
      document.addEventListener("keydown", handleKeyDownApp);
    };
    document.body.appendChild(script);
    gameState.scriptElement = script;
  }
});
