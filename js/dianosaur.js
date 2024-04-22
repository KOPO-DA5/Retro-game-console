var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var img2 = new Image();
img2.src = "dino.png";

var dino = {
  x: 10,
  y: 300, //공룡 등장 좌표
  width: 50,
  height: 50, //공룡 크기
  draw() {
    // ctx.fillStyle = "green";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(img2, this.x, this.y, this.width, this.height);
  },
};

var img1 = new Image();
img1.src = "cactus.png";

class Cactus {
  constructor() {
    this.x = 500;
    this.y = 325;
    this.width = 25;
    this.height = 25;
  }
  draw() {
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.x, this.y, this.width, this.height); //네모는 일명 hitbox
    ctx.drawImage(img1, this.x, this.y, this.width, this.height);
  }
}

var timer = 0;
var cactuses = []; //장애물 여러 개를 관리하기 위한 배열
var jumpTimer = 0;
var animation;

//프레임마다 실행할 함수(실행 횟수는 모니터 FPS에 따라 다름)
function executePerFrame() {
  animation = requestAnimationFrame(executePerFrame);
  //여기 안에 있는게 프레임마다 실행됨
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (timer % 240 === 0) {
    //120 프레임마다 장애물 생성하고 array에 집어넣음
    var cactus = new Cactus();
    cactuses.push(cactus);
  }

  //array에 있는거 한 번에 draw
  cactuses.forEach((a, i, o) => {
    //x 좌표가 0 미만이면 제거
    if (a.x < 0) {
      o.splice(i, 1);
    }
    a.x -= 2;

    isBumped(dino, a); //충돌 체크는 여기서. 공룡과 모든 장애물을 충돌 체크 해야 되기 때문

    a.draw();
  });

  if (jump == true) {
    dino.y -= 2; //점프 속도 조절 가능
    jumpTimer++; //점프 시 프레임마다 +1
  }
  if (jump == false) {
    if (dino.y < 300) {
      dino.y += 2;
    }
  }
  if (jumpTimer > 40) {
    jump = false;
    jumpTimer = 0;
  }

  dino.draw();
}
executePerFrame();

//충돌 확인
function isBumped(dino, cactus) {
  var xDif = cactus.x - (dino.x + dino.width);
  var yDif = cactus.y - (dino.y + dino.height);
  if (xDif < 0 && yDif < 0) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation); //애니메이션 중단
  }
}

var jump = false;
//스페이스바 누르면 점프
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    jump = true;
  }
});
