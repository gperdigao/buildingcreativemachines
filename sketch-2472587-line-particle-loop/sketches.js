let particles = [];
let explosion = false;
let timer = 0;
let assembleTime = 3000; // 3 seconds
let explosionTime = 5000; // 5 seconds
let lineSpeed = 10;
let colors;

function setup() {
  createCanvas(displayWidth, displayHeight); // Mobile screen size
  colors = [random(255), random(255), random(255)];
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(width / 2, height / 2));
  }
}

function draw() {
  background(0);
  timer += deltaTime;

  if (explosion) {
    for (let p of particles) {
      p.explode();
    }
    if (timer > assembleTime) {
      explosion = false;
      timer = 0;
      resetParticles();
      setRandomColors();
    }
  } else {
    if (timer > explosionTime) {
      explosion = true;
      timer = 0;
      for (let p of particles) {
        p.initiateExplosion();
      }
    } else {
      for (let i = 0; i < particles.length; i++) {
        let leader = i === 0 ? null : particles[i - 1];
        particles[i].moveAsQueue(leader);
      }
    }
  }

  for (let p of particles) {
    p.display();
  }
}

function resetParticles() {
  let startX = random(width * 0.1, width * 0.9);
  let startY = random(height * 0.1, height * 0.9);
  let gap = width / particles.length * 0.5;

  for (let i = 0; i < particles.length; i++) {
    particles[i].x = startX - i * gap;
    particles[i].y = startY;
    particles[i].tx = startX - i * gap;
    particles[i].ty = startY;
  }
}

function setRandomColors() {
  colors = [random(255), random(255), random(255)];
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tx = x;
    this.ty = y;
    this.explosionVector = createVector(0, 0);
    this.speed = lineSpeed;
  }

  moveAsQueue(leader) {
    if (leader) {
      this.tx = leader.x;
      this.ty = leader.y;
    } else {
      this.tx += random(-this.speed, this.speed);
      this.ty += random(-this.speed, this.speed);
    }

    this.tx = constrain(this.tx, 0, width);
    this.ty = constrain(this.ty, 0, height);

    this.x = lerp(this.x, this.tx, 0.1);
    this.y = lerp(this.y, this.ty, 0.1);
  }

  initiateExplosion() {
    this.explosionVector = p5.Vector.random2D().mult(random(50, 150));
  }

  explode() {
    this.x += this.explosionVector.x * 0.1;
    this.y += this.explosionVector.y * 0.1;
  }

  display() {
    noStroke();
    fill(colors[0], colors[1], colors[2]);
    ellipse(this.x, this.y, 10);
  }
}

function windowResized() {
  resizeCanvas(displayWidth, displayHeight);
}