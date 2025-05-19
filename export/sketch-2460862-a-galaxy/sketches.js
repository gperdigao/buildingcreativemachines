let particles = [];
let numParticles = 1500;
let blackHole;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize particles at random positions around the center
  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI);
    let radius = random(50, min(width, height) / 2);
    let x = width / 2 + radius * cos(angle);
    let y = height / 2 + radius * sin(angle);
    particles.push(new Particle(x, y));
  }

  // Create a black hole at the center
  blackHole = new BlackHole(width / 2, height / 2);
}

function draw() {
  background(10, 10, 30, 100);

  // Update and display particles
  for (let p of particles) {
    p.applyGravity(blackHole);
    p.update();
    p.display();
  }

  // Display black hole
  blackHole.display();

  t += 0.01;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.sub(this.pos, createVector(width / 2, height / 2)).rotate(HALF_PI).setMag(2);
    this.acc = createVector();
    this.color = color(random(200, 255), random(100, 200), random(200, 255));
    this.size = random(1, 3);
  }

  applyGravity(blackHole) {
    let force = p5.Vector.sub(blackHole.pos, this.pos);
    let distanceSq = constrain(force.magSq(), 100, 1000);
    let G = 5;
    let strength = G / distanceSq;
    force.setMag(strength);
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class BlackHole {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 50;
  }

  display() {
    noStroke();
    for (let i = this.size; i > 0; i -= 5) {
      fill(0, 0, 0, map(i, 0, this.size, 0, 255));
      ellipse(this.pos.x, this.pos.y, i * 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
