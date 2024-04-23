const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

//캔버스 크기 계산
ctx.canvas.height = COLS * BLOCK_SIZE;
ctx.canvas.width = ROWS * BLOCK_SIZE;

//블록 크기 변경
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
