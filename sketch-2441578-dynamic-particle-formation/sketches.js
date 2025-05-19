let particles = [];
let numParticles = 1000;
let formationType = 0;
let formations = [];
let transition = false;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize particles at random positions
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Define different mathematical formations
  formations = [
    (i) => { // Spiral
      let angle = map(i, 0, numParticles, 0, TWO_PI * 5);
      let radius = map(i, 0, numParticles, 0, min(width, height) / 3);
      return createVector(width / 2 + radius * cos(angle), height / 2 + radius * sin(angle));
    },
    (i) => { // Flower
      let angle = map(i, 0, numParticles, 0, TWO_PI * 8);
      let radius = sin(4 * angle) * min(width, height) / 4;
      return createVector(width / 2 + radius * cos(angle), height / 2 + radius * sin(angle));
    },
    (i) => { // Lissajous Curve
      let a = random(1, 5);
      let b = random(1, 5);
      let delta = random(TWO_PI);
      let angle = map(i, 0, numParticles, 0, TWO_PI * 5);
      let x = width / 2 + (width / 3) * sin(a * angle + delta);
      let y = height / 2 + (height / 3) * sin(b * angle);
      return createVector(x, y);
    },
    (i) => { // Circle
      let angle = map(i, 0, numParticles, 0, TWO_PI);
      let radius = min(width, height) / 3;
      return createVector(width / 2 + radius * cos(angle), height / 2 + radius * sin(angle));
    },
    (i) => { // Heart
      let angle = map(i, 0, numParticles, -PI, PI);
      let x = 16 * pow(sin(angle), 3);
      let y = 13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle);
      return createVector(width / 2 + x * 10, height / 2 - y * 10);
    },
    (i) => { // Random Bezier Curve
      let p0 = createVector(random(width), random(height));
      let p1 = createVector(random(width), random(height));
      let p2 = createVector(random(width), random(height));
      let p3 = createVector(random(width), random(height));
      let t = map(i, 0, numParticles, 0, 1);
      let pos = cubicBezier(p0, p1, p2, p3, t);
      return pos;
    }
  ];

  // Initialize first formation
  setFormation();
}

function draw() {
  background(10, 10, 30, 50);

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  t += 0.01;
}

function mousePressed() {
  // Change formation on mouse click
  formationType = (formationType + 1) % formations.length;
  setFormation();
}

function setFormation() {
  // Assign target positions to particles based on the current formation
  for (let i = 0; i < particles.length; i++) {
    let target = formations[formationType](i);
    particles[i].setTarget(target.x, target.y);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 10;
    this.maxForce = 1;
    this.color = color(255, 255, 255);
    this.size = random(1, 3);
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

    // Fade color based on speed
    let speedMag = this.vel.mag();
    let alpha = map(speedMag, 0, this.maxSpeed, 50, 255);
    this.color.setAlpha(alpha);
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  setTarget(x, y) {
    this.target = createVector(x, y);
  }
}

function cubicBezier(p0, p1, p2, p3, t) {
  let a = p0.copy().mult(pow(1 - t, 3));
  let b = p1.copy().mult(3 * t * pow(1 - t, 2));
  let c = p2.copy().mult(3 * pow(t, 2) * (1 - t));
  let d = p3.copy().mult(pow(t, 3));
  return a.add(b).add(c).add(d);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setFormation();
}
