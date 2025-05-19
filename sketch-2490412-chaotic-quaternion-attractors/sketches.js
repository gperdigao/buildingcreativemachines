let particles = [];
let numParticles = 500;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noFill();
  strokeWeight(1);
  
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10);
  rotateX(sin(t * 0.002) * PI / 4);
  rotateY(cos(t * 0.002) * PI / 4);
  
  stroke(255, 150);
  
  for (let p of particles) {
    p.update();
    p.show();
  }
  
  t += 0.5;
}

class Particle {
  constructor() {
    this.pos = createVector(random(-1, 1), random(-1, 1), random(-1, 1)).mult(100);
    this.vel = createVector();
  }

  update() {
    let q = quaternionAttractor(this.pos, t * 0.001);
    this.vel.set(q.x, q.y, q.z).mult(0.1);
    this.pos.add(this.vel);

    // Wrap around if out of bounds
    let bounds = 300;
    if (this.pos.mag() > bounds) {
      this.pos.set(random(-1, 1), random(-1, 1), random(-1, 1)).mult(100);
    }
  }

  show() {
    point(this.pos.x, this.pos.y, this.pos.z);
  }
}

function quaternionAttractor(p, time) {
  let a = sin(time) * 1.5;
  let b = cos(time * 1.3) * 0.8;
  let c = sin(time * 0.7) * 1.2;
  let d = cos(time * 1.1) * 0.9;

  // Quaternion rotation-based attractor equations
  let x = p.x * (a + b * p.z) + c * p.y * p.z - d * p.y;
  let y = p.y * (b + c * p.x) - a * p.x * p.z + d * p.z;
  let z = p.z * (c + d * p.y) - b * p.x * p.y + a * p.x;

  return createVector(x, y, z).mult(0.005);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
