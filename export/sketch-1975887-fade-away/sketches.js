let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0, 10); // Slowly fade out the background

  // Create new particles
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }

  // Update and display particles
  for (let i = particles.length-1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    if (p.isDead()) {
      // Remove dead particles
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 5)); // Set initial velocity
    this.alpha = 255;
  }

  update() {
    this.alpha -= 2; // Fade out over time
    this.pos.add(this.vel);
  }

  display() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }

  isDead() {
    return this.alpha < 0;
  }
}
