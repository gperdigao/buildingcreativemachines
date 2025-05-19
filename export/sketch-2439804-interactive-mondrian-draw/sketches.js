let colors = ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];
let largeGrid, smallGrid;
let clicks = 0;

function setup() {
  createCanvas(600, 600);
  largeGrid = 120; // Start with large grid
  smallGrid = 30;  // Switch to fine-tune grid later
  noLoop();
  drawInitialGrid();
}

function drawInitialGrid() {
  background(255);
  for (let x = 0; x < width; x += largeGrid) {
    for (let y = 0; y < height; y += largeGrid) {
      strokeWeight(6);
      stroke(0);
      fill(random(colors));
      rect(x, y, largeGrid, largeGrid);
    }
  }
}

function mousePressed() {
  clicks++;
  let grid = clicks > 4 ? smallGrid : largeGrid;  // Switch to smaller grid after a few clicks
  let x = floor(mouseX / grid) * grid;
  let y = floor(mouseY / grid) * grid;
  let w = grid * floor(random(1, 3));
  let h = grid * floor(random(1, 3));

  fill(random(colors));
  strokeWeight(clicks > 4 ? 3 : 6);
  stroke(0);
  rect(x, y, w, h);

  if (clicks > 10) {
    noLoop(); // Stop if sufficiently detailed
  }
}
