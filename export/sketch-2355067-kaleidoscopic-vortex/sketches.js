// Kaleidoscopic Vortex Particle System
// Particles are influenced by dynamic vortices, creating intense and colorful swirling patterns.

let particles = [];
let numParticles = 1000;
let time = 0;
let timeIncrement = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  background(0);
}

function draw() {
  background(0, 0, 0, 25); // Slight trail effect with higher opacity for intense colors
  
  for (let p of particles) {
    p.update();
    p.show();
  }
  
  time += timeIncrement;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prevPos = this.pos.copy();
    this.speed = random(2, 5);
    this.color = color(random(360), 100, 100, 80);
  }
  
  update() {
    let angle = getVortexAngle(this.pos.x, this.pos.y, time);
    let vel = p5.Vector.fromAngle(angle);
    vel.mult(this.speed);
    this.prevPos = this.pos.copy();
    this.pos.add(vel);
    
    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  show() {
    stroke(this.color);
    strokeWeight(2);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
  }
}

function getVortexAngle(x, y, t) {
  // Create dynamic vortices influenced by mouse position and time
  let dx = x - mouseX;
  let dy = y - mouseY;
  let distance = sqrt(dx * dx + dy * dy);
  let angle = atan2(dy, dx);
  
  // Vortex intensity decreases with distance from mouse
  let intensity = constrain(200 / (distance + 50), 0, 10);
  
  // Add time-based variation for dynamic effect
  angle += sin(t * 5 + distance * 0.02) * intensity;
  
  return angle;
}

function mousePressed() {
  // Add burst of particles at mouse position
  for (let i = 0; i < 50; i++) {
    let p = new Particle(mouseX, mouseY);
    particles.push(p);
  }
}
