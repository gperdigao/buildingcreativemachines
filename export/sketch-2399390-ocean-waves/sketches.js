let yOffsetStart = 0;
let waveDetail = 200;
let waveHeight = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255, 150); // Set line color to a smooth white with transparency
  strokeWeight(1); // Use thin lines
  noFill();
}

function draw() {
  background(20, 40, 70); // Deep ocean-like background
  translate(0, height / 2); // Move origin to center of the canvas vertically
  
  let frequency = map(mouseX, 0, width, 0.001, 0.05); // Adjust wave frequency with mouseX
  let amplitude = map(mouseY, 0, height, 20, waveHeight); // Adjust wave height with mouseY
  
  beginShape();
  
  let yOffset = yOffsetStart; // Starting point for Perlin noise
  
  for (let x = 0; x <= width; x += width / waveDetail) {
    // Perlin noise creates smooth, flowing variation in the Y direction
    let y = sin(x * frequency) * amplitude + map(noise(yOffset), 0, 1, -50, 50); // Combine sin wave with Perlin noise
    vertex(x, y); // Create the wave vertex point
    yOffset += 0.05; // Increment for smooth noise
  }
  
  endShape();
  
  yOffsetStart += 0.01; // Shift the noise offset gradually to create fluid motion
}
