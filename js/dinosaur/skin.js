function loadGameSkin() {
  const content = document.getElementById('content');

  content.innerHTML = `
      <link rel="stylesheet" href="../css/dinosaur.css" />
      <div class="parent">
        <div class="button-container">
          <div class="button-wrapper">
            <button class="button">
              <img src="../images/dinosaur/dino-stationary.png" alt="이미지_설명">
            </button>
            <button class="button">
              <img src="../images/dinosaur/dino-stationary.png" alt="이미지_설명">
            </button>
            <button class="button">
              <img src="../images/dinosaur/dino-stationary.png" alt="이미지_설명">
            </button>
          </div>
        </div>
      </div>
    `;

  // 버튼 요소들을 가져와서 선택된 버튼 표시를 초기화합니다.
  const buttons = document.querySelectorAll('.button');
  let selectedIndex = 0;
  updateSelectedButton();

  // 처음에 첫 번째 버튼 강조
  buttons[selectedIndex].classList.add('selected');

  // 키보드 이벤트 핸들러 함수
  function handleKeyPress(event) {
    const key = event.key;

    if (key === 'ArrowLeft') {
      // 왼쪽 화살표를 누른 경우
      selectedIndex = Math.max(0, selectedIndex - 1); // 선택된 버튼 인덱스를 이동
      updateSelectedButton(); // 선택된 버튼 표시 업데이트
    } else if (key === 'ArrowRight') {
      // 오른쪽 화살표를 누른 경우
      selectedIndex = Math.min(buttons.length - 1, selectedIndex + 1); // 선택된 버튼 인덱스를 이동
      updateSelectedButton(); // 선택된 버튼 표시 업데이트
    } else if (key === ' ') {
      // 스페이스 바를 누른 경우
      buttons[selectedIndex].click(); // 선택된 버튼 클릭
    }
  }

  // 선택된 버튼 표시를 업데이트하는 함수
  function updateSelectedButton() {
    buttons.forEach((button, index) => {
      if (index === selectedIndex) {
        // 현재 선택된 버튼인 경우
        button.classList.add('selected'); // 선택된 버튼 표시 추가
      } else {
        button.classList.remove('selected'); // 선택된 버튼 표시 제거
      }
    });
  }

  // 키보드 이벤트 핸들러 함수를 등록합니다.
  document.addEventListener('keydown', handleKeyPress);

  // 마우스 호버 효과 제거
  buttons.forEach((button) => {
    button.addEventListener('mouseover', () => {
      button.classList.remove('selected');
    });
    button.addEventListener('mouseout', () => {
      updateSelectedButton();
    });
  });
}
