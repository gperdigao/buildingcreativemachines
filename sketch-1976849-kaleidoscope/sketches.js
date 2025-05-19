let segments = 0;
let rotAngle = 0.0;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100); // Use hue, saturation, brightness
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  // The number of reflections depends on the mouse's horizontal position
  segments = map(mouseX, 0, width, 5, 10, true);
  rotAngle = 360.0 / segments;

  for (let i = 0; i < segments; i++) {
    push();
    rotate(i * rotAngle);
    createSegment();
    pop();
  }
}

function createSegment() {
  beginShape();
  for (let i = 0; i <= 180; i++) {
    let rad = map(i, 0, 180, 0, 150);
    let x = rad * cos(i);
    let y = rad * sin(i);
    let col = map(mouseY, 0, height, 0, 360); // The hue depends on the mouse's vertical position
    fill(col, 100, 100);
    vertex(x, y);
  }
  endShape(CLOSE);
}
