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
                <h2>클릭 카운터 게임</h2>
                <p>버튼을 클릭할 때마다 카운터가 증가합니다.</p>
                <button onclick="increaseCounter()">클릭</button>
                <p id="counter">0</p>
            `;
  } else if (gameId === "game2") {
    content.innerHTML = `
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
