let cols, rows;
let scale = 4; // Distance between lines
let noiseStrength = 3; // Controls the "turbulence" of the lines

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scale);
  rows = floor(height / scale);
  noFill();
  stroke(0, 100); // Semi-transparent black lines
}

function draw() {
  background(255);
  let yOffset = 0;
  for (let y = 0; y < rows; y++) {
    beginShape();
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      // Create a flowing pattern using Perlin noise
      let angle = noise(xOffset, yOffset, frameCount * 0.01) * TWO_PI;
      let xPos = x * scale + cos(angle) * noiseStrength * scale;
      let yPos = y * scale + sin(angle) * noiseStrength * scale;
      vertex(xPos, yPos);
      xOffset += 0.1;
    }
    endShape();
    yOffset += 0.1;
  }
}
