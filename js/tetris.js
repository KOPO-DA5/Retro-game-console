// tetris.js
function loadGameTetris() {
  const content = document.getElementById("content");

  var newStyle = document.createElement("link");
  newStyle.setAttribute("rel", "stylesheet");

  resetAnimation(content); // 애니메이션 초기화
  updateGameContent(); // 콘텐츠 업데이트

  // 애니메이션 시작
  content.classList.add("fade-in");
}

function resetAnimation(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth; // DOM 리플로우 강제 실행으로 CSS 애니메이션 리셋
  element.classList.add("fade-in");
}

function updateGameContent() {
  const content = document.getElementById("content");
  content.innerHTML = `
                <link rel="stylesheet" href="./css/tetris.css" />
                <div class="grid">
                 <canvas id="board" class="game-board"></canvas>
                 <div class="right-column">
                    <div>
                        <h1>TETRIS</h1>
                        <p>Score: <span id="score">0</span></p>
                        <p>Lines: <span id="lines">0</span></p>
                        <p>Level: <span id="level">0</span></p>
                        <canvas id="next" class="next"></canvas>
                    </div>
                    <button onclick="play()" class="play-button">Play</button>
                    </div>
                </div>
                
            `;
  /* js부르는 법 */

  let scriptToConstants = document.createElement("script");
  scriptToConstants.type = "text/javascript";
  scriptToConstants.src = "./js/tetris/constants.js";
  document.body.appendChild(scriptToConstants);

  let scriptToBoard = document.createElement("script");
  scriptToBoard.type = "text/javascript";
  scriptToBoard.src = "./js/tetris/board.js";
  document.body.appendChild(scriptToBoard);

  let scriptToPiece = document.createElement("script");
  scriptToPiece.type = "text/javascript";
  scriptToPiece.src = "./js/tetris/piece.js";
  document.body.appendChild(scriptToPiece);

  let scriptTomain = document.createElement("script");
  scriptTomain.type = "text/javascript";
  scriptTomain.src = "./js/tetris/main.js";
  document.body.appendChild(scriptTomain);
}
