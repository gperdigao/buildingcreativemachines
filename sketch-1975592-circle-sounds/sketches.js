let osc;
let backgroundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundColor = color(255, 0, 0);

  // Initialize the oscillator
  osc = new p5.Oscillator('sine');
}

function draw() {
  background(backgroundColor);
  fill(255);
  circle(mouseX, mouseY, 80);
}

function touchStarted() {
  // Change the background color
  backgroundColor = color(random(255), random(255), random(255));

  // Play a sound
  osc.start();
  osc.freq(random(200, 800));
  osc.amp(0.5, 0.1);

  // Prevent default touch actions
  return false;
}

function touchEnded() {
  // Stop the sound
  osc.amp(0, 0.5);

  // Prevent default touch actions
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
