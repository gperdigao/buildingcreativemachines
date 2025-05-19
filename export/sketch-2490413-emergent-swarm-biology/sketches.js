let particles = [];
let numParticles = 100;
let maxForce = 0.03;
let perceptionRadius = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(10, 20);
  for (let p of particles) {
    p.flock(particles);
    p.update();
    p.edges();
    p.show();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 2;
  }

  flock(particles) {
    let alignment = this.align(particles);
    let cohesion = this.cohere(particles);
    let separation = this.separate(particles);

    alignment.mult(1.0); // Tendency to align direction
    cohesion.mult(0.7);  // Attraction to others
    separation.mult(1.5); // Avoid crowding

    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(separation);
  }

  align(particles) {
    let avgVel = createVector();
    let count = 0;
    for (let other of particles) {
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (other !== this && d < perceptionRadius) {
        avgVel.add(other.vel);
        count++;
      }
    }
    if (count > 0) {
      avgVel.div(count);
      avgVel.setMag(this.maxSpeed);
      avgVel.sub(this.vel);
      avgVel.limit(maxForce);
    }
    return avgVel;
  }

  cohere(particles) {
    let center = createVector();
    let count = 0;
    for (let other of particles) {
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (other !== this && d < perceptionRadius) {
        center.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      center.div(count);
      let desired = p5.Vector.sub(center, this.pos);
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(maxForce);
      return steer;
    }
    return createVector();
  }

  separate(particles) {
    let steer = createVector();
    let count = 0;
    for (let other of particles) {
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (other !== this && d < perceptionRadius / 2) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(maxForce);
    }
    return steer;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    fill(255, 150);
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
