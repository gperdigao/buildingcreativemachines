// Neon Rotating "G" Animation in p5.js

let angle = 0; // Rotation angle
let fontSize = 200; // Base font size
let glowLayers = 10; // Number of glow layers
let neonColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textFont('Arial'); // You can choose any font you like
  neonColor = color(0, 255, 255); // Cyan neon color
  background(10); // Dark background to enhance neon effect
}

function draw() {
  background(10, 10, 10, 50); // Semi-transparent background for trailing effect

  push();
  translate(width / 2, height / 2);
  rotate(angle);
  
  // Draw multiple layers for the neon glow
  for (let i = glowLayers; i > 0; i--) {
    let layerColor = lerpColor(color(0, 255, 255, 50 / i), neonColor, 1);
    fill(layerColor);
    noStroke();
    textSize(fontSize + i * 5); // Slightly increase size for outer glow
    text('G', 0, 0);
  }

  // Draw the main "G"
  fill(neonColor);
  noStroke();
  textSize(fontSize);
  text('G', 0, 0);
  
  pop();

  angle += 0.5; // Adjust rotation speed here
}

// Adjust canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
