let grid;
let cols, rows;
let cellSize = 20;
let colors;

function setup() {
  createCanvas(800, 800);
  cols = width / cellSize;
  rows = height / cellSize;

  colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];

  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = random(colors);
    }
  }
}

function draw() {
  background(220);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(grid[i][j]);
      stroke(0);
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

function mousePressed() {
  let x = floor(mouseX / cellSize);
  let y = floor(mouseY / cellSize);

  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    grid[x][y] = random(colors);
  }
}
