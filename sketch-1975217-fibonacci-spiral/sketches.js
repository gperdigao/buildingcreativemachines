let fibs = [0, 1];

function setup() {
  createCanvas(800, 800);
  background(0);
  angleMode(DEGREES); // Change the mode to DEGREES
  colorMode(HSB);
  noFill();
  
  // Generate the first 30 Fibonacci numbers
  for (let i = 2; i < 30; i++) {
    fibs[i] = fibs[i - 1] + fibs[i - 2];
  }
}

function draw() {
  background(0);
  
  // Draw the Fibonacci Spiral
  translate(width / 2, height / 2); // Move the origin to the center of the canvas
  let numSpirals = map(mouseX, 0, width, 1, 30); // Map the mouse x position to the number of spirals
  for (let i = 0; i < numSpirals; i++) {
    let radius = fibs[i] * 10; // Scale up the size for better visibility
    stroke(i * 8, 255, 255); // Color each circle differently
    strokeWeight(3); // Make the lines thicker
    if (i % 4 === 0) {
      arc(-radius / 2, -radius / 2, radius, radius, 0, 90);
    } else if (i % 4 === 1) {
      arc(radius / 2, -radius / 2, radius, radius, 90, 180);
    } else if (i % 4 === 2) {
      arc(radius / 2, radius / 2, radius, radius, 180, 270);
    } else if (i % 4 === 3) {
      arc(-radius / 2, radius / 2, radius, radius, 270, 360);
    }
  }
}
