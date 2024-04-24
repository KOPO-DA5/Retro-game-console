const canvasBoard = document.getElementById("board");
const ctxBoard = canvasBoard.getContext("2d");

//캔버스 크기 계산
ctxBoard.canvas.width = COLS * BLOCK_SIZE;
ctxBoard.canvas.height = ROWS * BLOCK_SIZE;

//블록 크기 변경
ctxBoard.scale(BLOCK_SIZE, BLOCK_SIZE);

//Play 실행 함수
let board = new Board();
//board.reset();

function play() {
  // console.table(board.grid);

  board.reset();
  ctxBoard.clearRect(0, 0, ctxBoard.canvas.width, ctxBoard.canvas.height);
  //board = board.getEmptyBoard();
  let piece = new Piece(ctxBoard);
  piece.draw();
  
  board.piece = piece;
  
}

moves = {
  [KEY.LEFT]: p => ({...p, x: p.x - 1}),
  [KEY.RIGHT]: p => ({...p, x: p.x + 1}),
  [KEY.UP]: p => ({...p, y: p.y - 1}),
  [KEY.DOWN]: p => ({...p, y: p.y + 1})
};

document.addEventListener('keydown', event => {
  if(moves[event.keyCode]) {
    event.preventDefault();

    let p = moves[event.keyCode](board.piece);

    // if(board.valid(p)) {
    //   board.piece.move(p);
    //   ctxBoard.clearRect(0, 0, ctxBoard.canvas.width, ctxBoard.canvas.height);

    //   board.piece.draw();
    // }

    board.piece.move(p);

    ctxBoard.clearRect(0, 0, ctxBoard.canvas.width, ctxBoard.canvas.height);

    board.piece.draw();
  }
});