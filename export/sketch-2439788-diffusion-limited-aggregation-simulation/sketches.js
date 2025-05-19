let particles = [];
let center;

function setup() {
  createCanvas(600, 600);
  center = createVector(width / 2, height / 2);
  particles.push(new Particle(center.x, center.y, true));
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  background(0);
}

function draw() {
  background(0, 10); // slow fade for effect
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].move();
    particles[i].display();
    if (particles[i].stuck) continue;

    for (let j = 0; j < particles.length; j++) {
      if (particles[i] !== particles[j] && particles[j].stuck && particles[i].intersects(particles[j])) {
        particles[i].stuck = true;
        particles.push(new Particle(random(width), random(height)));
        break;
      }
    }
  }
}

class Particle {
  constructor(x, y, stuck = false) {
    this.pos = createVector(x, y);
    this.stuck = stuck;
    this.r = 4;
  }

  move() {
    if (!this.stuck) {
      this.pos.x += random(-2, 2);
      this.pos.y += random(-2, 2);
      this.pos.x = constrain(this.pos.x, 0, width);
      this.pos.y = constrain(this.pos.y, 0, height);
    }
  }

  intersects(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    return d < this.r * 2;
  }

  display() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}
