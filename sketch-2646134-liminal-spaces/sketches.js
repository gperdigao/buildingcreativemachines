let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(15, 15, 30); // dark ambience

  const steps = 25; // number of rectangles to draw
  for (let i = 0; i < steps; i++) {
    let p = i / steps;
    let w = lerp(width * 1.4, 40, p);
    let h = lerp(height * 1.4, 40, p);
    let offset = sin(t + p * 5) * 60; // offset to create drifting spaces

    push();
    translate(width / 2 + offset, height / 2 + offset);
    rotate(sin(t + p * 3) * 0.1);
    stroke(lerpColor(color(50, 60, 80), color(230, 230, 255), p));
    rect(0, 0, w, h);
    pop();
  }

  t += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
