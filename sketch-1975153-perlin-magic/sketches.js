let scl = 20;
let cols, rows;

let zoff = 0;

let particles = [];

let flowfield;

let attractors = []; // Array to hold attractor points

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 255);
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);
  for (let i = 0; i < 500; i++) {
    particles[i] = new Particle();
  }
  background(51);
}

function draw() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += 0.1;
    }
    yoff += 0.1;
  }
  zoff += 0.01;

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }

  // If mouse is pressed, create new particles at mouse position
  if (mouseIsPressed) {
    particles.push(new Particle(mouseX, mouseY, random(255)));
  }

  // Apply attraction force
  attractors.forEach(attractor => {
    particles.forEach(particle => {
      particle.attract(attractor);
    });
  });
}

// When mouse is clicked, create a new attractor at mouse position
function mouseClicked() {
  attractors.push(createVector(mouseX, mouseY));
}

function Particle(x, y, hue) {
  if (x && y) {
    // If position is given, use that
    this.pos = createVector(x, y);
  } else {
    // Else, start at random position
    this.pos = createVector(random(width), random(height));
  }
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 2;

  // If hue is given, use that
  this.hue = hue || random(255);

  this.prevPos = this.pos.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.follow = function(flowfield) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = flowfield[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.show = function() {
    stroke(this.hue, 255, 255, 25);
    this.hue = this.hue + 1 % 255;
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function() {
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

  // Attraction to a point
  this.attract = function(target) {
    let force = p5.Vector.sub(target, this.pos); // A vector pointing from the position to the target
    let dsquared = force.magSq(); // Distance squared
    dsquared = constrain(dsquared, 25, 500); // Limiting the distance to eliminate "extreme" results for very close or very far objects
    const G = 50; // Gravitational constant
    let strength = G / dsquared; // Calculate gravitation magnitude
    force.setMag(strength);
    this.acc.add(force);
  }
}
