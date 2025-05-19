let cols, rows;
let grid;
let ant;

function setup() {
  createCanvas(600, 600);
  cols = width / 10;
  rows = height / 10;
  grid = Array.from({ length: cols }, () => Array(rows).fill(0));
  ant = new Ant(floor(cols / 2), floor(rows / 2));
  frameRate(30);
}

function draw() {
  background(255);
  drawGrid();
  ant.update();
}

function drawGrid() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      fill(grid[x][y] == 1 ? 0 : 255);
      noStroke();
      rect(x * 10, y * 10, 10, 10);
    }
  }
}

class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dir = 0; // 0=up, 1=right, 2=down, 3=left
  }

  update() {
    if (grid[this.x][this.y] == 0) {
      this.turnRight();
      grid[this.x][this.y] = 1;
    } else {
      this.turnLeft();
      grid[this.x][this.y] = 0;
    }
    this.move();
  }

  turnRight() {
    this.dir = (this.dir + 1) % 4;
  }

  turnLeft() {
    this.dir = (this.dir + 3) % 4;
  }

  move() {
    if (this.dir == 0) this.y = (this.y - 1 + rows) % rows;
    if (this.dir == 1) this.x = (this.x + 1) % cols;
    if (this.dir == 2) this.y = (this.y + 1) % rows;
    if (this.dir == 3) this.x = (this.x - 1 + cols) % cols;
  }
}
