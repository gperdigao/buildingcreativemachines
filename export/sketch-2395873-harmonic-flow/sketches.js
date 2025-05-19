let particles = [];
let numParticles = 500;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1); // Set color mode to HSB with alpha from 0 to 1
  background(0);
  noStroke();
  
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Semi-transparent background for trailing effect
  background(0, 0, 0, 0.05);
  t += 0.01;

  for (let p of particles) {
    p.update();
    p.show();
  }
}

function mouseMoved() {
  interactWithParticles(mouseX, mouseY);
}

function touchMoved() {
  interactWithParticles(mouseX, mouseY);
  return false; // Prevent default behavior
}

function interactWithParticles(x, y) {
  for (let p of particles) {
    let d = dist(p.pos.x, p.pos.y, x, y);
    if (d < 100) {
      let angle = atan2(p.pos.y - y, p.pos.x - x);
      p.vel.x += cos(angle) * 0.5;
      p.vel.y += sin(angle) * 0.5;
    }
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.size = random(2, 5);
    this.hue = random(360);
  }

  update() {
    let angle = noise(this.pos.x * 0.005, this.pos.y * 0.005, t) * TWO_PI * 2;
    let v = p5.Vector.fromAngle(angle);
    v.mult(0.5);
    this.vel.add(v);
    this.vel.limit(2);
    this.pos.add(this.vel);

    // Wrap around the edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    fill((this.hue + frameCount * 0.5) % 360, 80, 100, 0.8);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
