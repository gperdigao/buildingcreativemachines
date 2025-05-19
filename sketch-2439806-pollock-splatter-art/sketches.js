let colors = ['#1b263b', '#e63946', '#457b9d', '#f4a261', '#2a9d8f', '#264653'];
let maxSplatterSize = 50;
let splatterIntensity = 100;

function setup() {
  createCanvas(800, 800);
  background(255);
  noLoop();
}

function drawSplatter(x, y, size) {
  for (let i = 0; i < splatterIntensity; i++) {
    let angle = random(TWO_PI);
    let radius = random(size * 0.2, size);
    let xOffset = cos(angle) * radius;
    let yOffset = sin(angle) * radius;
    
    noStroke();
    fill(random(colors) + hex(floor(random(100, 255)), 2));
    ellipse(x + xOffset, y + yOffset, random(2, 10));
  }
}

function drawDrip(x, y) {
  let dripLength = random(20, 60);
  strokeWeight(random(2, 5));
  stroke(random(colors) + hex(floor(random(100, 255)), 2));
  
  let xEnd = x + random(-10, 10);
  let yEnd = y + dripLength;
  line(x, y, xEnd, yEnd);
}

function mousePressed() {
  let size = random(20, maxSplatterSize);
  drawSplatter(mouseX, mouseY, size);

  // Add drips to simulate paint flowing
  for (let i = 0; i < random(1, 5); i++) {
    drawDrip(mouseX + random(-size / 2, size / 2), mouseY + random(-size / 2, size / 2));
  }

  // Add finer splatters for texture
  for (let i = 0; i < random(10, 20); i++) {
    let xOffset = random(-size, size);
    let yOffset = random(-size, size);
    noStroke();
    fill(random(colors) + hex(floor(random(100, 255)), 2));
    ellipse(mouseX + xOffset, mouseY + yOffset, random(1, 4));
  }
}
