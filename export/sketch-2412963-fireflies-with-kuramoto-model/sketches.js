let fireflies = [];
let numFireflies = 100;
let couplingStrength = 0.05; // Controls synchronization speed

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  for (let i = 0; i < numFireflies; i++) {
    fireflies.push(new Firefly(random(width), random(height)));
  }
}

function draw() {
  background(0, 50); // Slight trail effect
  for (let firefly of fireflies) {
    firefly.move();
    firefly.updatePhase(fireflies);
    firefly.display();
  }
}

function mouseMoved() {
  // Attract fireflies to mouse position
  for (let firefly of fireflies) {
    firefly.attract(mouseX, mouseY);
  }
}

class Firefly {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(0.5, 2));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2;
    this.phase = random(TWO_PI); // Phase of blinking
    this.frequency = random(0.9, 1.1); // Natural frequency
    this.size = 8;
  }

  move() {
    // Update velocity and position
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    // Reset acceleration
    this.acceleration.mult(0);

    // Wrap around edges
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  attract(targetX, targetY) {
    let target = createVector(targetX, targetY);
    let force = p5.Vector.sub(target, this.position);
    let distance = force.mag();
    if (distance > 0 && distance < 200) {
      force.setMag(map(distance, 0, 200, 0.5, 0));
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  updatePhase(fireflies) {
    // Update phase based on the Kuramoto model
    let sum = 0;
    let count = 0;
    for (let other of fireflies) {
      if (other !== this) {
        let distance = p5.Vector.dist(this.position, other.position);
        if (distance < 100) { // Interaction radius
          sum += sin(other.phase - this.phase);
          count++;
        }
      }
    }
    if (count > 0) {
      let deltaPhase = this.frequency + (couplingStrength / count) * sum;
      this.phase += deltaPhase * 0.05;
    } else {
      this.phase += this.frequency * 0.05;
    }
    this.phase = this.phase % TWO_PI;
  }

  display() {
    // Calculate brightness based on phase
    let brightness = map(sin(this.phase), -1, 1, 50, 255);
    let size = map(brightness, 50, 255, this.size, this.size * 1.5);
    let hue = map(this.phase, 0, TWO_PI, 0, 360);

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + PI / 2);
    noStroke();
    fill(hue, 200, brightness);
    triangle(0, -size, -size / 2, size / 2, size / 2, size / 2);
    pop();
  }
}
