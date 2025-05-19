let particles = [];
let maxParticles = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(255, 20); // Light background with slight opacity for smooth trails
  for (let particle of particles) {
    particle.update();
    particle.display();
  }

  // Draw connections between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
      if (d < 70) { // Connect particles within a certain distance
        stroke(0, 20);
        strokeWeight(0.5);
        line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
      }
    }
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = random(1, 3); // Smaller size for elegant look
    this.color = color(random(150, 255), random(120, 200), random(200, 255), 150); // Softer pastel-like colors
    this.angleOffset = random(TWO_PI); // Unique noise offset for smoother flow
  }

  update() {
    let angle = noise(this.pos.x * 0.002, this.pos.y * 0.002, this.angleOffset) * TWO_PI * 2;
    this.acc = p5.Vector.fromAngle(angle).mult(0.2); // Slower, more controlled movement
    this.vel.add(this.acc);
    this.vel.limit(1); // Slower movement for smoother flow
    this.pos.add(this.vel);

    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
