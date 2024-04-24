class Board {
  grid;
  piece;

  reset() {
    this.grid = this.getEmptyBoard();
    this.piece = new Piece()
  }

  getEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  isInsideWalls(x, y) {
    return x >= 0 && x < COLS && y <= ROWS;
  }

  notOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          value === 0 ||
          (this.isInsideWalls(x, y) && this.notOccupied(x, y))
        );
      });
    });
  }

  rotate(piece) {
    let p = JSON.parse(JSON.stringify(piece));

    if(!piece.hardDropped) {
      for(let y = 0; y < p.shape.length; ++y) {
        for(let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
    }
    p.shape.forEach(row => row.reverse());

    return p;
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }
}