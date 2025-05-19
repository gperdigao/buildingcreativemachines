let particles = [];
let circles = [];
let maxCircles = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1.5);

  for (let i = 0; i < maxCircles; i++) {
    let r = random(20, height / 4);
    circles.push(new Circle(random(width), random(height), r));
  }
  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 20);

  // Draw circles
  stroke(255, 50);
  for (let c of circles) {
    c.show();
  }

  // Update and show particles
  stroke(255, 200);
  for (let p of particles) {
    p.update(circles);
    p.show();
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  show() {
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
  }

  update(circles) {
    this.pos.add(this.vel);

    // Reflect off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Reflect off circles
    for (let c of circles) {
      let d = dist(this.pos.x, this.pos.y, c.x, c.y);
      if (d < c.r) {
        let normal = createVector(this.pos.x - c.x, this.pos.y - c.y).normalize();
        this.vel.reflect(normal);
        break;
      }
    }
  }

  show() {
    point(this.pos.x, this.pos.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
