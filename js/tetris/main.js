const canvasBoard = document.getElementById("board");
const ctxBoard = canvasBoard.getContext("2d");

//캔버스 크기 계산
ctxBoard.canvas.width = COLS * BLOCK_SIZE;
ctxBoard.canvas.height = ROWS * BLOCK_SIZE;

//블록 크기 변경
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

//Play 실행 함수
let board = new Board();

function play() {
  board.reset();
  console.table(board.grid);
}
