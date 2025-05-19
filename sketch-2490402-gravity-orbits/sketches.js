let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
  strokeWeight(1.5);
}

function draw() {
  background(0, 10);
  translate(width / 2, height / 2);

  for (let p of particles) {
    p.update();
    p.show();
  }
}

class Particle {
  constructor() {
    this.angle = random(TWO_PI);
    this.radius = random(width * 0.05, width * 0.4);
    this.speed = sqrt(2000 / this.radius); // Physics-based orbital speed
    this.x = cos(this.angle) * this.radius;
    this.y = sin(this.angle) * this.radius;
    this.trail = [];
  }

  update() {
    this.angle += this.speed / this.radius;
    this.x = cos(this.angle) * this.radius;
    this.y = sin(this.angle) * this.radius;

    this.trail.push(createVector(this.x, this.y));
    if (this.trail.length > 50) this.trail.shift();
  }

  show() {
    stroke(255, 100);
    noFill();
    beginShape();
    for (let pos of this.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
