let coin = 0;
const coinImg = document.querySelector('#game-coin-img');
const mainPage = document.querySelector('#main-page');
// const joyStick_app = document.querySelector('#game-joystick-img');
// const yellowBtn = document.querySelector('#game-yellow-btn-img');
// const greenBtn = document.querySelector('#game-green-btn-img');
// const blueBtn = document.querySelector('#game-blue-btn-img');
const gameControler = document.write('<script src="./js/gameControler.js"></script>');

function getCoin() {
  return coin;
}

document.addEventListener('DOMContentLoaded', function () {
  const content = document.getElementById('content');
  resetAnimation(content);
  playSound('mainBgm');
  function resetAnimation(element) {
    element.classList.remove('fade-in');
    void element.offsetWidth;
    element.classList.add('fade-in');
  }

  function handleKeyDownApp(event) {
    if (!GlobalState.isGameActive) {
      if(event.key === "Insert") {
        coinImg.style.display = "block";
        coinImg.classList.add('animate__animated', 'animate__flip'); 

        coinImg.addEventListener('animationend', () => {
          coinImg.classList.remove('animate__animated', 'animate__flip');

          coinImg.style.display = "none";

          setTimeout(function(){
            mainPage.style.transform = 'scale(1.9)';
            mainPage.style.transition = '.5s';
            mainPage.style.overflow = 'hidden';
          },100);
        });
      
        coin += 5;
        console.log(coin);
      }
      if(coin > 0) {
        gameControl(event.key);
        if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "ArrowDown") {
          toggleGameSelection();
        }
        
        if (event.key === "Enter") {
          loadSelectedGame(GlobalState.currentGame);
        }
      }

    
    }
  }

  // 게임 선택 이벤트 리스너 등록
  document.addEventListener('keydown', handleKeyDownApp);

  function toggleGameSelection() {
    if (!GlobalState.isGameActive) {
      GlobalState.currentGame = GlobalState.currentGame === 'Tetris' ? 'Dino' : 'Tetris';
      var displayGame = GlobalState.currentGame === 'Tetris' ? '← Tetris →' : '← Dino →';
      document.getElementById('selected-game').textContent = displayGame;
    }
  }

  function loadSelectedGame(game) {
    GlobalState.isGameActive = true;
    if (GlobalState.scriptElement) {
      document.body.removeChild(GlobalState.scriptElement);
    }

    let scriptPath = game === 'Tetris' ? 'js/tetris.js' : 'js/dinosaur/skin.js';
    let script = document.createElement('script');
    script.src = scriptPath;
    script.onload = function () {
      if (game === 'Tetris') {
        loadGameTetris();
      } else {
        loadGameSkin();
      }
    };
    document.body.appendChild(script);
    GlobalState.scriptElement = script;
  }

  function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
  }
});
