let barrier;
let particles = [];

function setup() {
  createCanvas(800, 400);
  barrier = new Barrier(width / 2, height / 2, 20, 100);
}

function draw() {
  background(220);

  barrier.show();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();

    if (particles[i].x > width) {
      particles.splice(i, 1);
    }
  }

  if (random() < 0.05) {
    particles.push(new Particle(50, height / 2));
  }
}

class Barrier {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    fill(255, 0, 0);
    rect(this.x, this.y - this.h / 2, this.w, this.h);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.tunneled = false;
  }

  update() {
    if (this.x > barrier.x && this.x < barrier.x + barrier.w && !this.tunneled) {
      if (random() < 0.01) { // 1% chance to tunnel
        this.y = barrier.y + barrier.h / 2 + 10;
        this.tunneled = true;
      }
    }
    this.x += this.speed;
  }

  show() {
    fill(0, 0, 255);
    ellipse(this.x, this.y, 10);
  }
}
