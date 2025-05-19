let grid;
let next;
let dA = 1.0;
let dB = 0.5;
let feed = 0.055;
let k = 0.062;
let canvasSize;
let pixelDensityValue;

function setup() {
  canvasSize = min(windowWidth, windowHeight);
  createCanvas(canvasSize, canvasSize);
  pixelDensityValue = pixelDensity();
  
  // Initialize grid and next arrays
  grid = [];
  next = [];
  for (let x = 0; x < width * pixelDensityValue; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < height * pixelDensityValue; y++) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
    }
  }

  // Seed the initial pattern in the center with integer indices
  let centerX = floor(width / 2);
  let centerY = floor(height / 2);
  for (let i = centerX - 10; i < centerX + 10; i++) {
    for (let j = centerY - 10; j < centerY + 10; j++) {
      if (i >= 0 && i < width * pixelDensityValue && j >= 0 && j < height * pixelDensityValue) {
        grid[i][j].b = 1;
      }
    }
  }
}

function draw() {
  background(245, 245, 220, 10); // Slightly transparent background for trailing effect

  // Perform one step of the simulation
  for (let x = 1; x < width * pixelDensityValue - 1; x++) {
    for (let y = 1; y < height * pixelDensityValue - 1; y++) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;

      // Gray-Scott Reaction-Diffusion equations
      next[x][y].a = a + (dA * laplaceA(x, y) - a * b * b + feed * (1 - a)) * 1;
      next[x][y].b = b + (dB * laplaceB(x, y) + a * b * b - (k + feed) * b) * 1;

      // Constrain the values between 0 and 1
      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }

  // Update the pixel array for visualization
  loadPixels();
  for (let x = 0; x < width * pixelDensityValue; x++) {
    for (let y = 0; y < height * pixelDensityValue; y++) {
      let pix = (x + y * width * pixelDensityValue) * 4;
      let a = next[x][y].a;
      let b = next[x][y].b;
      let c = floor((a - b) * 255);

      // Apply smooth and thin lines with grayscale coloring
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;     // Red
      pixels[pix + 1] = c;     // Green
      pixels[pix + 2] = c;     // Blue
      pixels[pix + 3] = 255;   // Alpha
    }
  }
  updatePixels();

  // Swap the grids for the next iteration
  let temp = grid;
  grid = next;
  next = temp;
}

// Laplace operator for chemical A
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

// Laplace operator for chemical B
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

// Allow the user to interact by adding chemical B with mouse drag
function mouseDragged() {
  let x = floor(mouseX * pixelDensityValue);
  let y = floor(mouseY * pixelDensityValue);
  if (x > 1 && x < width * pixelDensityValue - 1 && y > 1 && y < height * pixelDensityValue - 1) {
    grid[x][y].b = 1;
    grid[x - 1][y].b = 1;
    grid[x + 1][y].b = 1;
    grid[x][y - 1].b = 1;
    grid[x][y + 1].b = 1;
  }
}

// Adjust the canvas and reinitialize the grid upon window resize
function windowResized() {
  canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);
  
  // Reinitialize grid and next arrays
  grid = [];
  next = [];
  for (let x = 0; x < width * pixelDensityValue; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < height * pixelDensityValue; y++) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
    }
  }

  // Seed the initial pattern in the center with integer indices
  let centerX = floor(width / 2);
  let centerY = floor(height / 2);
  for (let i = centerX - 10; i < centerX + 10; i++) {
    for (let j = centerY - 10; j < centerY + 10; j++) {
      if (i >= 0 && i < width * pixelDensityValue && j >= 0 && j < height * pixelDensityValue) {
        grid[i][j].b = 1;
      }
    }
  }
}
