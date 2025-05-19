let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0);
  
  // Desenhar partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p instanceof ParticleExplosion && p.isFinished()) {
      particles.splice(i, 1);
    }
  }

  // Desenhar estrela rotativa
  push();
  translate(width / 2, height / 2);
  rotate(frameCount);
  fill(255, 204, 0);
  noStroke();
  drawStar(0, 0, 100, 50, 5);
  pop();
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = 360 / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = random(100, 255);
    this.size = random(2, 5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Envolver nas bordas
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

class ParticleExplosion extends Particle {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.alpha = 255;
    this.size = random(2, 5);
    this.lifetime = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime -= 5;
    this.alpha = this.lifetime;
  }

  isFinished() {
    return this.lifetime < 0;
  }
}

function mousePressed() {
  for (let i = 0; i < 50; i++) {
    particles.push(new ParticleExplosion(mouseX, mouseY));
  }
}

function touchStarted() {
  mousePressed();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
