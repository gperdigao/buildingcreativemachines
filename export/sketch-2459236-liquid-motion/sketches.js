let particles = [];
let numParticles = 2000;
let flowField;
let cols, rows;
let scale = 10;
let zOff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  cols = floor(width / scale);
  rows = floor(height / scale);
  flowField = new Array(cols * rows);
  for (let i = 0; i < numParticles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(0, 10);
  let yOff = 0;
  for (let y = 0; y < rows; y++) {
    let xOff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xOff, yOff, zOff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.5);
      flowField[index] = v;
      xOff += 0.1;
    }
    yOff += 0.1;
  }
  zOff += 0.005;

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowField);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

function mouseDragged() {
  particles.push(new Particle(mouseX, mouseY));
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x || random(width), y || random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.prevPos = this.pos.copy();
    this.hue = random(360);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors) {
    let x = floor(this.pos.x / scale);
    let y = floor(this.pos.y / scale);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    stroke((this.hue + frameCount) % 360, 255, 255, 50);
    strokeWeight(2);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
