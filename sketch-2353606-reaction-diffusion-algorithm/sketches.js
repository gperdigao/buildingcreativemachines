let grid, nextGrid;
let dA = 1.0;
let dB = 0.5;
let feed = 0.055;
let kill = 0.062;
let width = 200;
let height = 200;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  grid = [];
  nextGrid = [];

  // Initialize the grids
  for (let x = 0; x < width; x++) {
    grid[x] = [];
    nextGrid[x] = [];
    for (let y = 0; y < height; y++) {
      grid[x][y] = { a: 1, b: 0 };
      nextGrid[x][y] = { a: 1, b: 0 };
    }
  }

  // Seed the grid with a circle of "B" chemical
  for (let i = -10; i < 10; i++) {
    for (let j = -10; j < 10; j++) {
      let x = width / 2 + i;
      let y = height / 2 + j;
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[x][y].b = 1;
      }
    }
  }
}

function draw() {
  background(0);

  // Run the reaction-diffusion algorithm
  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;

      // Laplacian diffusion
      let lapA = laplaceA(x, y);
      let lapB = laplaceB(x, y);

      // Reaction-diffusion equations
      let reaction = a * b * b;
      nextGrid[x][y].a =
        a +
        (dA * lapA - reaction + feed * (1 - a)) * 1;
      nextGrid[x][y].b =
        b +
        (dB * lapB + reaction - (kill + feed) * b) * 1;

      // Constrain values between 0 and 1
      nextGrid[x][y].a = constrain(nextGrid[x][y].a, 0, 1);
      nextGrid[x][y].b = constrain(nextGrid[x][y].b, 0, 1);
    }
  }

  // Swap the grids
  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let pix = (x + y * width) * 4;
      let a = grid[x][y].a;
      let b = grid[x][y].b;
      let c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;
      pixels[pix + 1] = c;
      pixels[pix + 2] = c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();

  // Display the simulation scaled up
  noSmooth();
  image(
    get(0, 0, width, height),
    0,
    0,
    width * 3,
    height * 3
  );

  // Interaction with the mouse
  if (mouseIsPressed) {
    let mx = floor(map(mouseX, 0, width * 3, 0, width));
    let my = floor(map(mouseY, 0, height * 3, 0, height));
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        let x = mx + i;
        let y = my + j;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          grid[x][y].b = 1;
        }
      }
    }
  }
}

// Laplacian functions for A and B chemicals
function laplaceA(x, y) {
  let sumA = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[x - 1][y].a * 0.2;
  sumA += grid[x + 1][y].a * 0.2;
  sumA += grid[x][y + 1].a * 0.2;
  sumA += grid[x][y - 1].a * 0.2;
  sumA += grid[x - 1][y - 1].a * 0.05;
  sumA += grid[x + 1][y - 1].a * 0.05;
  sumA += grid[x + 1][y + 1].a * 0.05;
  sumA += grid[x - 1][y + 1].a * 0.05;
  return sumA;
}

function laplaceB(x, y) {
  let sumB = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[x - 1][y].b * 0.2;
  sumB += grid[x + 1][y].b * 0.2;
  sumB += grid[x][y + 1].b * 0.2;
  sumB += grid[x][y - 1].b * 0.2;
  sumB += grid[x - 1][y - 1].b * 0.05;
  sumB += grid[x + 1][y - 1].b * 0.05;
  sumB += grid[x + 1][y + 1].b * 0.05;
  sumB += grid[x - 1][y + 1].b * 0.05;
  return sumB;
}
