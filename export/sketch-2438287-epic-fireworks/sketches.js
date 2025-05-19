// "Epic Fireworks Display" 

let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(0);
  frameRate(60);
}

function draw() {
  background(0, 25); // Semi-transparent background for trail effect
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();

    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

function mousePressed() {
  fireworks.push(new Firework(mouseX, mouseY));
}

function touchStarted() {
  fireworks.push(new Firework(mouseX, mouseY));
  return false; // Prevent default behavior
}

class Firework {
  constructor(x, targetY) {
    this.position = createVector(x, height);
    this.velocity = createVector(0, random(-12, -8));
    this.acceleration = createVector(0, 0);
    this.exploded = false;
    this.particles = [];
    this.color = color(random(360), 255, 255);
    this.targetY = targetY;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    if (!this.exploded) {
      this.applyForce(createVector(0, 0.2)); // Gravity
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
      if (this.position.y <= this.targetY || this.velocity.y >= 0) {
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, 0.2)); // Gravity
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    this.exploded = true;
    let numParticles = random(50, 150);
    for (let i = 0; i < numParticles; i++) {
      let p = new Particle(this.position.x, this.position.y, this.color);
      this.particles.push(p);
    }
  }

  done() {
    return this.exploded && this.particles.length == 0;
  }

  display() {
    if (!this.exploded) {
      stroke(this.color);
      strokeWeight(4);
      point(this.position.x, this.position.y);
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(2, 10));
    this.acceleration = createVector(0, 0);
    this.lifespan = 255;
    this.color = color;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.mult(0.95); // Air resistance
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 4;
  }

  done() {
    return this.lifespan < 0;
  }

  display() {
    strokeWeight(2);
    stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    point(this.position.x, this.position.y);
  }
}
