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
