let particles = [];
let maxParticles = 500;
let palette = [];
let backgroundColor;
let attractor;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  backgroundColor = color(0, 0, 0);
  
  // Define a vibrant color palette
  palette = [
    color(210, 100, 100, 80),
    color(30, 100, 100, 80),
    color(120, 100, 100, 80),
    color(270, 100, 100, 80),
    color(330, 100, 100, 80)
  ];
  
  // Initialize attractor at the center
  attractor = createVector(width / 2, height / 2);
}

function draw() {
  // Semi-transparent background for trailing effect
  background(backgroundColor.levels[0], backgroundColor.levels[1], backgroundColor.levels[2], 10);
  
  // Update attractor position based on mouse
  attractor.x = mouseX;
  attractor.y = mouseY;
  
  // Emit new particles
  if (particles.length < maxParticles) {
    particles.push(new Particle(attractor.x, attractor.y));
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Optional: Visualize the attractor
  noStroke();
  fill(0, 0, 100, 50);
  ellipse(attractor.x, attractor.y, 20, 20);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    let angle = random(TWO_PI);
    let speed = random(1, 3);
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.size = random(4, 8);
    this.color = random(palette);
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    // Calculate attraction towards attractor
    let force = p5.Vector.sub(attractor, this.pos);
    let distance = force.mag();
    distance = constrain(distance, 5, 25);
    force.normalize();
    let strength = map(distance, 5, 25, 0.5, 0.05);
    force.mult(strength);
    this.applyForce(force);
    
    // Update velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Apply friction
    this.vel.mult(0.95);
    
    // Fade out
    this.lifespan -= 2;
  }
  
  display() {
    noStroke();
    fill(hue(this.color), saturation(this.color), brightness(this.color), this.lifespan / 2);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
    
    // Draw trailing lines
    stroke(hue(this.color), saturation(this.color), brightness(this.color), this.lifespan / 2);
    strokeWeight(2);
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x * 2, this.pos.y - this.vel.y * 2);
  }
  
  isDead() {
    return this.lifespan <= 0;
  }
}

function mousePressed() {
  // On mouse press, emit a burst of particles
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('LuminousFlow', 'png');
  }
}
