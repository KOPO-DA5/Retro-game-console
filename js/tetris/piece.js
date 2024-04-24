class Piece {
    x;
    y;
    color;
    shape;
    ctx; 

    constructor(ctx) {
        this.ctx = ctx;
        this.spawn();
    }

    spawn() {
        const typeId = this.randomizeTetrominoType(COLORS.length);
        this.shape = SHAPES[typeId];
        this.color = COLORS[typeId];

        this.x = 3;
        this.y = 0;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value > 0) {
              this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
              //console.log(this.x + x);
              console.log(this.y + y);
            }
          });
        });
    }

    move(p) {
        this.x = p.x;
        this.y = p.y;
    }

    randomizeTetrominoType(noOfTypes) {
        return Math.floor(Math.random() * noOfTypes + 1);
    }

}
