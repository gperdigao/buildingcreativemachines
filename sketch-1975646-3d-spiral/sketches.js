let angle = 0;
let w = 24;
let ma;
let maxD;
let rotationSpeed = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  ma = atan(cos(QUARTER_PI));
  maxD = dist(0, 0, 200, 200);
}

function draw() {
  background(100);
  ortho(-400, 400, 400, -400, 0, 1000);

  rotateX(-QUARTER_PI);
  rotateY(ma);

  let offset = 0;
  for (let z = 0; z < height; z += w) {
    for (let x = 0; x < width; x += w) {
      push();
      let d = dist(x, z, width / 2, height / 2);
      let offset = map(d, 0, maxD, -PI, PI);
      let a = angle + offset;
      let h = floor(map(sin(a), -1, 1, 100, 300));
      translate(x - width / 2, 0, z - height / 2);
      normalMaterial();
      box(w - 2, h, w - 2);
      pop();
    }
  }

  angle -= rotationSpeed;
}

function touchMoved() {
  // Change rotation speed based on touch or mouse movement
  rotationSpeed = map(mouseX, 0, width, 0.01, 0.05);

  return false; // This prevents the default browser behavior for the touchmove event
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
