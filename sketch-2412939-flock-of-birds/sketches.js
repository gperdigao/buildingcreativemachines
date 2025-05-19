let flock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  flock = new Flock();
  // Add initial boids to the flock
  for (let i = 0; i < 100; i++) {
    let boid = new Boid(random(width), random(height));
    flock.addBoid(boid);
  }
}

function draw() {
  background(51);
  flock.run();
}

function mouseMoved() {
  // Update the target position to the mouse position
  flock.setTarget(createVector(mouseX, mouseY));
}

function mousePressed() {
  // Add a new boid at the mouse position
  flock.addBoid(new Boid(mouseX, mouseY));
}

class Flock {
  constructor() {
    this.boids = [];
    this.target = null;
  }

  run() {
    for (let boid of this.boids) {
      boid.flock(this.boids, this.target);
      boid.update();
      boid.borders();
      boid.render();
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }

  setTarget(target) {
    this.target = target;
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector(0, 0);
    this.maxForce = 0.05;
    this.maxSpeed = 3;
    this.r = 3.0; // Radius for rendering
  }

  flock(boids, target) {
    let sep = this.separate(boids).mult(1.5); // Separation
    let ali = this.align(boids).mult(1.0);    // Alignment
    let coh = this.cohesion(boids).mult(1.0); // Cohesion
    let tgt = createVector(0, 0);             // Attraction to target

    if (target) {
      let desired = p5.Vector.sub(target, this.position);
      let d = desired.mag();
      if (d > 0) {
        desired.normalize();
        desired.mult(this.maxSpeed);
        tgt = p5.Vector.sub(desired, this.velocity);
        tgt.limit(this.maxForce * 5); // Stronger attraction to mouse
      }
    }

    // Apply forces
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(tgt);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    // Update velocity and position
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    // Reset acceleration
    this.acceleration.mult(0);
  }

  render() {
    // Draw the boid as a triangle pointing in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    fill(127, 200);
    stroke(200);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  borders() {
    // Wrap around edges
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  separate(boids) {
    let desiredSeparation = 25;
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  align(boids) {
    let neighborDist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  cohesion(boids) {
    let neighborDist = 50;
    let sum = createVector(0, 0); // Position
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards average position
    } else {
      return createVector(0, 0);
    }
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }
}
