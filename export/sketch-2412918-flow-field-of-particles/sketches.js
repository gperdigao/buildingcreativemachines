let particles = [];
let flowField = [];
let cols, rows;
let scl = 20;
let zOffset = 0;
let inc = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(HSB, 360, 255, 255, 255);
  cols = floor(width / scl) + 1;
  rows = floor(height / scl) + 1;
  flowField = new Array(cols * rows);
  background(0);
  for (let i = 0; i < 5000; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  let yOffset = 0;
  for (let y = 0; y < rows; y++) {
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xOffset, yOffset, zOffset) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;
      xOffset += inc;
    }
    yOffset += inc;
  }
  zOffset += 0.003;

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowField);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

function mousePressed() {
  // Reset particles to mouse position on click
  for (let i = 0; i < particles.length; i++) {
    particles[i].position = createVector(mouseX, mouseY);
  }
}

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 4;
    this.hue = random(360);
  }

  follow(vectors) {
    let x = floor(this.position.x / scl);
    let y = floor(this.position.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  show() {
    stroke(this.hue, 255, 255, 25);
    strokeWeight(1);
    point(this.position.x, this.position.y);
    this.hue += 0.5;
    if (this.hue > 360) this.hue = 0;
  }
}
