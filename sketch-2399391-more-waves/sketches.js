let waveDetail = 200;
let waveHeight = 100;
let layers = 5; // Number of wave layers
let yOffsetStart = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255, 150); // Set stroke color to soft white
  strokeWeight(1); // Keep thin lines for elegance
  noFill();
}

function draw() {
  background(20, 40, 70); // Deep ocean-like background
  translate(0, height / 2); // Center vertically

  for (let l = 0; l < layers; l++) {
    let layerOffset = l * 0.2; // Offset each wave slightly for phase shift

    let frequency = map(mouseX, 0, width, 0.001, 0.05) * (1 + l * 0.3); // Slight variation for each layer
    let amplitude = map(mouseY, 0, height, 20, waveHeight) * (1 - l * 0.15); // Vary amplitude for layers

    beginShape();

    let yOffset = yOffsetStart + layerOffset; // Start with slight offset for each layer

    for (let x = 0; x <= width; x += width / waveDetail) {
      // Create smooth variation using sin() and noise()
      let y = sin(x * frequency + layerOffset) * amplitude + map(noise(yOffset), 0, 1, -50, 50);
      vertex(x, y); // Generate wave vertex
      yOffset += 0.05; // Increment yOffset for smooth noise transition
    }

    endShape();
  }

  yOffsetStart += 0.01; // Smooth motion for Perlin noise
}
