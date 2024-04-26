let globalSelectedCharacter;

function loadGameSkin() {
  const content = document.getElementById('content');

  content.innerHTML = `
      <link rel="stylesheet" href="../css/dinosaur.css" />
      <div class="parent">
        <div class="button-container">
          <div class="button-wrapper">
            <button class="button" data-character="kirby">
              <img src="../images/dinosaur/kirby/kirby-jump.png">
            </button>
            <button class="button" data-character="mario">
              <img src="../images/dinosaur/mario/mario-stationary.png" class="button-image">
            </button>
            <button class="button" color:white>
              <span style="color: white; font-weight: bold;">아직 없음</span>
            </button>
          </div>
        </div>
      </div>
    `;

  let selectedIndex = 0;
  const buttons = document.querySelectorAll('.button');
  updateSelectedButton();

  function handleKeyPress(event) {
    const key = event.key;

    if (key === 'ArrowLeft') {
      selectedIndex = Math.max(0, selectedIndex - 1);
      updateSelectedButton();
    } else if (key === 'ArrowRight') {
      selectedIndex = Math.min(buttons.length - 1, selectedIndex + 1);
      updateSelectedButton();
    } else if (key === ' ') {
      document.removeEventListener('keydown', handleKeyPress);
      event.preventDefault();

      let isScriptLoaded = document.querySelector('script[src="../js/dinosaur/dinosaur.js"]') !== null;
      globalSelectedCharacter = buttons[selectedIndex].getAttribute('data-character');

      if (!isScriptLoaded) {
        let script = document.createElement('script');
        script.src = '../js/dinosaur/dinosaur.js';
        script.onload = function () {
          if (typeof loadGameDino === 'function') {
            loadGameDino();
          }
        };
        document.head.appendChild(script);
      } else {
        if (typeof loadGameDino === 'function') {
          loadGameDino();
        }
      }
    }
  }

  function updateSelectedButton() {
    buttons.forEach((button, index) => {
      if (index === selectedIndex) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
  }

  document.addEventListener('keydown', handleKeyPress);
}