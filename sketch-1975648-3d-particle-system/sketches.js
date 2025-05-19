let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
}

function draw() {
  background(0);
  rotateX(PI/4);
  rotateY(millis() / 5000);
  
  if (random(1) < 0.1 && particles.length < 500) {
    particles.push(new Particle(0, 0, 0));
  }
  
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.vel = p5.Vector.random3D();
    this.vel.mult(random(0.5, 2));
    this.acc = createVector(0, 0, 0);
    this.lifespan = 255;
    this.hue = random(360);
  }
  
  finished() {
    return this.lifespan < 0;
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    if (this.vel.mag() < 1) {
      this.lifespan -= 5;
    }
    
    this.vel.limit(5);
    this.hue += 0.1;
    if (this.hue > 360) {
      this.hue = 0;
    }
  }
  
  show() {
    noStroke();
    fill(this.hue, 255, 255, this.lifespan);
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
