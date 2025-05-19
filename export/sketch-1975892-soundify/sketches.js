let mic;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
  
  for(let i = 0; i < 200; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(0);
  
  let vol = mic.getLevel();

  for(let i = 0; i < particles.length; i++) {
    particles[i].update(vol);
    particles[i].show(vol);
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.color = [random(255), random(255), random(255)];
  }

  update(vol) {
    this.acc.add(this.vel);
    this.pos.add(this.acc);
    this.acc.mult(0);
    this.vel.limit(vol * 25);  // Adjust movement speed with volume
    
    if (this.pos.x > width || this.pos.x < 0) this.vel.x *= -1;
    if (this.pos.y > height || this.pos.y < 0) this.vel.y *= -1;
  }

  show(vol) {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], 100);
    ellipse(this.pos.x, this.pos.y, vol * 200, vol * 200);  // Adjust size with volume
  }
}
