let colors;
let loopLimit = 20;
let resolutionIncrement = 0.5;
let offsetMultiplier = 6;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  noFill();
  colors = [
    color(255, 99, 71), // Red-Orange
    color(255, 165, 0),  // Orange
    color(0, 255, 255),  // Cyan
    color(255, 20, 147), // Pink
    color(75, 0, 130),   // Indigo
    color(255, 255, 0)   // Yellow
  ];
}

function draw() {
  background(250);
  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < loopLimit; i++) {
    push();
    rotate(sin(frameCount * 0.01 + i) * i);
    strokeWeight(map(sin(frameCount * 0.01 + i), -1, 1, 1, 5));
    stroke(colors[i % colors.length]);
    blobShape(map(mouseX, 0, width, 50, 200) + i * 10, i * 10);
    pop();
  }
  pop();
}

function blobShape(size, offset) {
  beginShape();
  for (let i = 0; i < TWO_PI; i += resolutionIncrement) {
    let xOffset = cos(i + offset) * offsetMultiplier;
    let yOffset = sin(i + offset) * offsetMultiplier;
    let x = (size + noise(xOffset, yOffset, frameCount * 0.01) * 50) * cos(i);
    let y = (size + noise(xOffset, yOffset, frameCount * 0.01) * 50) * sin(i);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
