// "Dynamic Flow Field" 🎨 #WCCChallenge
// 8th April 2024

let flowField;
let cols, rows;
let resolution = 20;
let particles = [];
let numParticles = 1000;
let zOffset = 0;
let colorPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  colorMode(HSB, 360, 100, 100, 100);
  
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  flowField = new Array(cols * rows);
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
  
  // Define a vibrant color palette
  colorPalette = [
    color(0, 100, 100, 30),
    color(30, 100, 100, 30),
    color(60, 100, 100, 30),
    color(120, 100, 100, 30),
    color(180, 100, 100, 30),
    color(240, 100, 100, 30),
    color(300, 100, 100, 30),
  ];
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 0, 0, 10);
  
  // Update flow field
  let yOffset = zOffset;
  for (let y = 0; y < rows; y++) {
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xOffset, yOffset, zOffset) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;
      xOffset += 0.1;
    }
    yOffset += 0.1;
  }
  zOffset += 0.003;
  
  // Update and display particles
  for (let particle of particles) {
    particle.follow(flowField);
    particle.update();
    particle.edges();
    particle.show();
  }
}

function mouseMoved() {
  addDisturbance();
}

function mouseDragged() {
  addDisturbance();
}

function addDisturbance() {
  let disturbanceRadius = 100;
  for (let particle of particles) {
    let d = dist(mouseX, mouseY, particle.pos.x, particle.pos.y);
    if (d < disturbanceRadius) {
      let force = p5.Vector.sub(particle.pos, createVector(mouseX, mouseY));
      force.setMag(0.5);
      particle.vel.add(force);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  flowField = new Array(cols * rows);
  background(0);
}

// Particle class
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.prevPos = this.pos.copy();
    this.hue = random(360);
  }
  
  follow(flow) {
    let x = floor(this.pos.x / resolution);
    let y = floor(this.pos.y / resolution);
    let index = x + y * cols;
    if (index >= 0 && index < flow.length) {
      let force = flow[index];
      this.applyForce(force);
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  show() {
    stroke(this.hue, 100, 100, 30);
    strokeWeight(1);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    this.prevPos = this.pos.copy();
  }
  
  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos = this.pos.copy();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos = this.pos.copy();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos = this.pos.copy();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos = this.pos.copy();
    }
  }
}
