let angle = 0;
let diameter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(220, 20, 60); // deep red
  noFill();
  strokeWeight(20);
  strokeCap(ROUND);
  diameter = min(width, height) * 0.6;
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  let endAngle = map(angle, 0, TWO_PI, 0, TWO_PI);
  arc(0, 0, diameter, diameter, 0, endAngle);
  angle += 0.03;
  if (angle > TWO_PI) {
    angle = 0;
  }
  resetMatrix();
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(32);
  text('日本', width - 50, height - 40); // identifies as Japanese
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  diameter = min(width, height) * 0.6;
}
