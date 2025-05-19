// Particle Vortex Simulation in 3D

let particles = [];
let numParticles = 3000;
let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 0, 0, 20); // Slightly transparent background for motion trails
  rotateY(angle);
  angle += 0.002;

  for (let p of particles) {
    p.update();
    p.show();
  }
}

// Particle class
class Particle {
  constructor() {
    this.theta = random(TWO_PI);
    this.phi = random(PI);
    this.radius = random(100, 500);
    this.speed = random(0.0005, 0.002);
    this.hue = random(360);
    this.size = random(1, 3);
  }

  update() {
    this.theta += this.speed;
    this.phi += this.speed / 2;

    // Convert spherical coordinates to Cartesian coordinates
    this.x = this.radius * sin(this.phi) * cos(this.theta);
    this.y = this.radius * sin(this.phi) * sin(this.theta);
    this.z = this.radius * cos(this.phi);

    // Update hue for color variation
    this.hue = (this.hue + 0.1) % 360;
  }

  show() {
    push();
    translate(this.x, this.y, this.z);
    ambientMaterial(this.hue, 80, 100);
    sphere(this.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
