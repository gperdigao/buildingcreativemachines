let t; // time variable

function setup() {
  createCanvas(800, 800);
  noFill();
  t = 0;
}

function draw() {
  background(0, 10); // Semi-transparent background (creates trails)

  // Create a new point with noise-function
  let x1 = noise(t + 15) * width;
  let y1 = noise(t) * height;

  let x2 = noise(t + 25) * width;
  let y2 = noise(t + 10) * height;

  let x3 = noise(t + 35) * width;
  let y3 = noise(t + 20) * height;

  let x4 = noise(t + 45) * width;
  let y4 = noise(t + 30) * height;

  // Draw the bezier curve
  stroke((t * 100) % 256, 255, 255); // Color changes over time
  bezier(x1, y1, x2, y2, x3, y3, x4, y4);

  t += 0.01; // Increment the time variable
}
