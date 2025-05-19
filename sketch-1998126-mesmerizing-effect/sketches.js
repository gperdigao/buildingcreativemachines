let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 25); // Slight transparency for a trail effect
  
  for (let particle of particles) {
    particle.attracted(createVector(mouseX, mouseY));
    particle.update();
    particle.show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.prev = this.pos.copy();
    this.vel = createVector();
    this.acc = createVector();
  }
  
  attracted(target) {
    let force = p5.Vector.sub(target, this.pos);
    let dsquared = force.magSq();
    dsquared = constrain(dsquared, 25, 500); 
    let strength = 6 / dsquared;
    force.setMag(strength);
    this.acc = force;
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(5); // Limit speed
    this.pos.add(this.vel);
  }
  
  show() {
    stroke(255, 150);
    strokeWeight(4);
    line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
    this.prev = this.pos.copy();
  }
}
