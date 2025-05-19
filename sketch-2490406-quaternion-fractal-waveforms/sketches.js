let points = [];
let angle = 0;
let scaleFactor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  scaleFactor = min(width, height) * 0.4;
  generateFractalPoints(6, 0, 0, scaleFactor);
  strokeWeight(1);
}

function draw() {
  background(10);
  translate(width / 2, height / 2);
  rotate(angle);

  stroke(255, 200);
  noFill();

  beginShape();
  for (let p of points) {
    let x = p.x * cos(angle) - p.y * sin(angle);
    let y = p.x * sin(angle) + p.y * cos(angle);
    vertex(x, y);
  }
  endShape(CLOSE);

  angle += 0.005;
}

function generateFractalPoints(depth, x, y, size) {
  if (depth == 0) {
    points.push(createVector(x, y));
    return;
  }

  let s = size / 2;
  generateFractalPoints(depth - 1, x - s, y - s, s);
  generateFractalPoints(depth - 1, x + s, y - s, s);
  generateFractalPoints(depth - 1, x - s, y + s, s);
  generateFractalPoints(depth - 1, x + s, y + s, s);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  points = [];
  scaleFactor = min(width, height) * 0.4;
  generateFractalPoints(6, 0, 0, scaleFactor);
}
