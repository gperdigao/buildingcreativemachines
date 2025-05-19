let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0, 10); // Slowly fade out the background

  let mousePos = createVector(mouseX, mouseY);

  // Create new particles
  if (frameCount % 10 == 0) {
    particles.push(new Particle(random(width), random(height), random(255), random(255), random(255)));
  }

  // Update and display particles
  for (let i = particles.length-1; i >= 0; i--) {
    let p = particles[i];
    p.seek(mousePos);
    p.update();
    p.display();
    if (p.isDead()) {
      // Remove dead particles
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, r, g, b) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = 255;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0); // Reset acceleration
    this.alpha -= 2; // Fade out over time
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.alpha);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }

  isDead() {
    return this.alpha < 0;
  }

  seek(target) {
    let force = p5.Vector.sub(target, this.pos);
    force.setMag(0.5); // Set force magnitude
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }
}
