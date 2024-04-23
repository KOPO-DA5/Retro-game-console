function loadGame(gameId) {
  const content = document.getElementById("content");

  resetAnimation(content); // 애니메이션 초기화
  updateGameContent(gameId); // 콘텐츠 업데이트

  // 애니메이션 시작
  content.classList.add("fade-in");
}

function resetAnimation(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth; // DOM 리플로우 강제 실행으로 CSS 애니메이션 리셋
  element.classList.add("fade-in");
}

function updateGameContent(gameId) {
  const content = document.getElementById("content");

  if (gameId === "game1") {
    content.innerHTML = `
                <div class="grid">
                 <canvas id="board" class="game-board"></canvas>
                 <div class="right-column">
                    <div>
                        <h1>TETRIS</h1>
                        <p>Score: <span id="score">0</span></p>
                        <p>Lines: <span id="lines">0</span></p>
                        <p>Level: <span id="level">0</span></p>
                    </div>
                    <button onclick="play()" class="play-button">Play</button>
                    </div>
                </div>
            `;
  } else if (gameId === "game2") {
    content.innerHTML = `
                <h2>텍스트 변경 게임</h2>
                <p>버튼을 클릭할 때마다 텍스트가 변경됩니다.</p>
                <button onclick="changeText()">텍스트 변경</button>
                <p id="displayText">여기에 텍스트가 표시됩니다.</p>
            `;
  } else if (gameId === "game3") {
    content.innerHTML = `               
    <canvas id="canvas"></canvas>
    <script src="./dianosaur.js"></script>`;
  }
}

let counter = 0;
function increaseCounter() {
  counter++;
  document.getElementById("counter").textContent = counter;
}

let textIndex = 0;
const texts = [
  "안녕하세요",
  "반갑습니다",
  "오늘도 좋은 하루!",
  "프로그래밍 재미있죠?",
];
function changeText() {
  textIndex = (textIndex + 1) % texts.length;
  document.getElementById("displayText").textContent = texts[textIndex];
}
