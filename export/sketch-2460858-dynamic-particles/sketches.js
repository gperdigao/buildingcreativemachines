let particles = [];
let numParticles = 800;
let formationIndex = 0;
let formations = [];
let colors = [];
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize colors
  for (let i = 0; i < numParticles; i++) {
    colors[i] = color(random(100, 255), random(100, 255), random(100, 255));
  }

  // Initialize particles at random positions
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height), colors[i]));
  }

  // Define different formations
  formations = [
    (i) => { // Smiley Face
      let angle = map(i % numParticles, 0, numParticles, 0, TWO_PI);
      let radius = min(width, height) / 4;

      let x = width / 2 + radius * cos(angle);
      let y = height / 2 + radius * sin(angle);

      // Eyes
      if (angle > PI / 8 && angle < PI / 8 * 3) {
        x = width / 2 - radius / 2.5 + random(-10, 10);
        y = height / 2 - radius / 2.5 + random(-10, 10);
      } else if (angle > PI / 8 * 5 && angle < PI / 8 * 7) {
        x = width / 2 + radius / 2.5 + random(-10, 10);
        y = height / 2 - radius / 2.5 + random(-10, 10);
      }
      // Mouth
      else if (angle > PI && angle < PI * 1.5) {
        x = width / 2 + (radius / 1.5) * cos(angle);
        y = height / 2 + (radius / 1.5) * sin(angle) + 30;
      }

      return createVector(x, y);
    },
    (i) => { // Heart Shape
      let angle = map(i % numParticles, 0, numParticles, -PI, PI);
      let x = 16 * pow(sin(angle), 3);
      let y = -(13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle));
      let scaleFactor = min(width, height) / 25;
      return createVector(width / 2 + x * scaleFactor, height / 2 + y * scaleFactor);
    },
    (i) => { // Star
      let angle = map(i % numParticles, 0, numParticles, 0, TWO_PI * 5);
      let radius = min(width, height) / 3;
      let r = radius * (cos(5 * angle) + 1) / 2;
      let x = width / 2 + r * cos(angle);
      let y = height / 2 + r * sin(angle);
      return createVector(x, y);
    },
    (i) => { // Spiral Galaxy
      let angle = map(i, 0, numParticles, 0, TWO_PI * 4);
      let radius = map(i, 0, numParticles, 0, min(width, height) / 2);
      let offset = sin(angle * 3) * 50;
      let x = width / 2 + (radius + offset) * cos(angle);
      let y = height / 2 + (radius + offset) * sin(angle);
      return createVector(x, y);
    },
    (i) => { // Random Burst
      return createVector(random(width), random(height));
    }
  ];

  // Set initial formation
  setFormation();
}

function draw() {
  background(30, 30, 60, 100);

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  t += 0.01;
}

function mousePressed() {
  // Change formation on mouse click
  formationIndex = (formationIndex + 1) % formations.length;
  setFormation();
}

function setFormation() {
  // Assign target positions to particles based on the current formation
  for (let i = 0; i < particles.length; i++) {
    let target = formations[formationIndex](i);
    particles[i].setTarget(target.x, target.y);
  }
}

class Particle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 10;
    this.maxForce = 1;
    this.color = col;
    this.size = random(2, 5);
  }

  update() {
    // Arrival behavior towards target
    let desired = p5.Vector.sub(this.target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);

    this.acc.add(steer);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  setTarget(x, y) {
    this.target = createVector(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setFormation();
}
