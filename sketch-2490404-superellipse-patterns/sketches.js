let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(0, 20);
  translate(width / 2, height / 2);

  let n = map(sin(t * 0.01), -1, 1, 2, 8); // Superellipse power evolves dynamically
  let a = width * 0.3;
  let b = height * 0.3;

  stroke(255, 200);
  for (let k = 1; k < 8; k++) {
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.01) {
      let cosPart = pow(abs(cos(angle)), 2 / n) * (cos(angle) > 0 ? 1 : -1);
      let sinPart = pow(abs(sin(angle)), 2 / n) * (sin(angle) > 0 ? 1 : -1);
      let x = a * cosPart * k * 0.15;
      let y = b * sinPart * k * 0.15;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  t += 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
