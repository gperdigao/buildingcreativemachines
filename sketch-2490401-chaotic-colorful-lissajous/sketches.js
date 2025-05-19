let t = 0;
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(2);
  generateColors();
}

function draw() {
  background(0, 15);
  translate(width / 2, height / 2);
  let a = 3;
  let b = 2;

  for (let i = 0; i < colors.length; i++) {
    stroke(colors[i]);
    beginShape();
    for (let j = 0; j < TWO_PI; j += 0.01) {
      let x = cos(a * j + t * i * 0.01) * (width / 3 - i * 10);
      let y = sin(b * j + t * i * 0.01) * (height / 3 - i * 10);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  t += 0.05;
}

function generateColors() {
  for (let i = 0; i < 10; i++) {
    colors.push(color(random(255), random(255), random(255), 150));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
