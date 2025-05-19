let particles = [];
let stuck = [];

function setup() {
  createCanvas(800, 800);
  background(0);
  particles.push(new Particle(width / 2, height / 2, true));
}

function draw() {
  background(0);

  let total = 2;
  for (let i = 0; i < total; i++) {
    particles.push(new Particle(random(width), random(height), false));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];

    particle.update();
    particle.show();

    if (particle.isStuck(stuck)) {
      stuck.push(particle);
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, stuck) {
    this.x = x;
    this.y = y;
    this.stuck = stuck;
  }

  update() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }

  show() {
    noStroke();
    if (this.stuck) fill(255, 0, 0);
    else fill(255);
    ellipse(this.x, this.y, 2);
  }

  isStuck(others) {
    for (let other of others) {
      let d = dist(this.x, this.y, other.x, other.y);
      if (d < 2) {
        this.stuck = true;
        return true;
      }
    }
    return false;
  }
}
