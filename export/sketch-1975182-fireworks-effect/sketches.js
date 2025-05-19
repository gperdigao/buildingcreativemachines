let particles = [];

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 255);
}

function draw() {
  background(0);
  
  // Create new particles at mouse position
  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      let p = new Particle(mouseX, mouseY, random(0, 255));
      particles.push(p);
    }
  }
  
  // Update and show particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].finished()) {
      // If the particle's life has ended, remove it
      particles.splice(i, 1);
    } else {
      particles[i].update(); // Update particle position
      particles[i].show(); // Draw particle
    }
  }
}

function Particle(x, y, hue) {
  this.pos = createVector(x, y); // Position
  this.vel = p5.Vector.random2D(); // Velocity
  this.acc = createVector(0, 0); // Acceleration
  this.lifespan = 255; // Lifespan
  
  // Color
  this.hue = hue;
  
  // Update position and velocity
  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 1; // Decrease lifespan
  }

  // Draw particle
  this.show = function() {
    stroke(this.hue, 255, 255, this.lifespan);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }

  // Check if particle's life has ended
  this.finished = function() {
    return this.lifespan < 0;
  }
}
