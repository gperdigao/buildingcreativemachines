// Epic Kaleidoscopic Experience in p5.js
// A completely different visual adventure featuring evolving gradients and rotating, noise‐distorted polygons.
// Works on any screen, desktop or mobile, and is optimized for smooth performance.

let numLayers = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  // Use HSB to create vivid, shifting colors.
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  strokeWeight(2);
}

function draw() {
  // Smooth trailing effect with a translucent black background
  background(0, 0, 0, 20);
  
  // --- Evolving Background Gradient ---
  push();
  translate(width / 2, height / 2);
  // The background gradient circle spans most of the smaller screen dimension.
  let bgRadius = min(width, height) * 0.8;
  let gradientSteps = 50;
  for (let i = gradientSteps; i > 0; i--) {
    let inter = map(i, 0, gradientSteps, 0, 1);
    let r = bgRadius * inter;
    noStroke();
    // Slowly shifting hues with a very low opacity creates a luminous glow.
    fill((frameCount * 0.2 + i * 3) % 360, 50, 100, 10);
    ellipse(0, 0, r, r);
  }
  pop();
  
  // --- Rotating Kaleidoscope of Irregular Polygons ---
  translate(width / 2, height / 2);
  let numSymmetries = 8;
  for (let i = 0; i < numSymmetries; i++) {
    push();
    // Each symmetry segment rotates continuously.
    rotate((360 / numSymmetries) * i + frameCount * 0.3);
    
    // Draw multiple layers of noise-distorted polygons
    for (let layer = 1; layer <= numLayers; layer++) {
      // Base radius increases with each layer.
      let baseRadius = layer * 40;
      // If the mouse is pressed, amplify the effect for interactivity.
      if (mouseIsPressed) {
        baseRadius *= 1.5;
      }
      // Set stroke color with shifting hues.
      stroke((frameCount + layer * 50) % 360, 80, 100, 70);
      beginShape();
      // Create a polygon with noise-modulated vertices for organic distortion.
      let vertices = 12;
      for (let j = 0; j < vertices; j++) {
        let angle = map(j, 0, vertices, 0, 360);
        // Use noise to perturb the radius of each vertex.
        let noiseVal = noise(layer * 10, j * 0.5, frameCount * 0.01);
        let r = baseRadius + noiseVal * 30;
        let x = r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
