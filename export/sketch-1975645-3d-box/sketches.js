let angle = 0;
let colorR = 255;
let colorG = 0;
let colorB = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(200);
  
  rotateX(angle);
  rotateY(angle);
  rotateZ(angle);

  fill(colorR, colorG, colorB);
  box(100);
  
  angle += 0.01;
}

function touchStarted() {
  // Change color when touched or clicked
  colorR = random(255);
  colorG = random(255);
  colorB = random(255);
  
  return false; // This prevents the default browser behavior for the touch event
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
