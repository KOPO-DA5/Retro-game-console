const joyStick = document.querySelector("#game-joystick-img");
const yellowBtn = document.querySelector("#game-yellow-btn-img");
const greenBtn = document.querySelector("#game-green-btn-img");
const blueBtn = document.querySelector("#game-blue-btn-img");

function gameControl(key) {
  if (key === "ArrowRight" || key === 39) {
    joyStick.classList.add("joystick-right");
  } else if (key === "ArrowLeft" || key === 37) {
    joyStick.classList.add("joystick-left");
  } else if (key === "ArrowUp" || key === 38) {
    joyStick.classList.add("joystick-up");
  } else if (key === "ArrowDown" || key === 40) {
    joyStick.classList.add("joystick-down");
  }

  joyStick.addEventListener("animationend", () => {
    joyStick.classList.remove(
      "joystick-right",
      "joystick-left",
      "joystick-up",
      "joystick-down"
    );
  });

  if (key === "Enter" || key === 13) {
    greenBtn.classList.add("push-green-btn");
    greenBtn.addEventListener("animationend", () => {
      greenBtn.classList.remove("push-green-btn");
    });
  } else if (key === "Space" || key === 32) {
    yellowBtn.classList.add("push-yellow-btn");
    yellowBtn.addEventListener("animationend", () => {
      yellowBtn.classList.remove("push-yellow-btn");
    });
  } else if (key === "Escape" || key === 27) {
    blueBtn.classList.add("push-blue-btn");
    blueBtn.addEventListener("animationend", () => {
      blueBtn.classList.remove("push-blue-btn");
    });
  }
}
