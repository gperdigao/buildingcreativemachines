let angle = 0;
let rotateTorus = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
  noStroke();
}

function draw() {
  background(0);
  let locX = mouseX - height / 2;
  let locY = mouseY - width / 2;

  // Set point lights with different colors
  pointLight(0, 100, 100, locX, locY, 200);
  pointLight(100, 100, 100, -locX, -locY, -200);

  // Visual representation of point lights
  push();
  translate(locX, locY, 200);
  fill(0, 100, 100);
  sphere(50); // Increased sphere size
  pop();

  push();
  translate(-locX, -locY, -200);
  fill(100, 100, 100);
  sphere(50); // Increased sphere size
  pop();

  // Rotate the torus
  if (rotateTorus) {
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
  }

  // Draw the torus
  normalMaterial();
  torus(100, 25);

  angle += 0.03;
}

function mousePressed() {
  rotateTorus = !rotateTorus;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
