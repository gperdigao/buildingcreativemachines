let pendulums = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 3; i++) {
    pendulums[i] = new Pendulum(width / 4 * (i + 1), height / 4, 200);
  }
}

function draw() {
  background(220);
  for (let pendulum of pendulums) {
    pendulum.update();
    pendulum.checkCollision();
    pendulum.display();
  }
}

function mousePressed() {
  for (let pendulum of pendulums) {
    pendulum.clicked(mouseX, mouseY);
  }
}

function mouseReleased() {
  for (let pendulum of pendulums) {
    pendulum.stopDragging();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Pendulum {
  constructor(x, y, l) {
    this.origin = createVector(x, y);
    this.position = createVector(x, y + l);
    this.r = this.origin.dist(this.position);
    this.angle = PI/2;
    this.aVelocity = 0.0;
    this.aAcceleration = 0.0;
    this.damping = 0.995;
    this.dragging = false;
  }

  update() {
    if (!this.dragging) {
      let gravity = 0.4;
      this.aAcceleration = (gravity / this.r) * cos(this.angle);
      this.aVelocity += this.aAcceleration;
      this.aVelocity *= this.damping;
      this.angle += this.aVelocity;
    } else {
      this.r = dist(this.origin.x, this.origin.y, mouseX, mouseY);
      this.angle = atan2(mouseY - this.origin.y, mouseX - this.origin.x);
    }

    this.position = p5.Vector.add(this.origin, createVector(this.r * cos(this.angle), this.r * sin(this.angle)));
  }

  checkCollision() {
    for (let other of pendulums) {
      if (other != this) {
        let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (distance < 48) { 
          let angle = atan2(this.position.y - other.position.y, this.position.x - other.position.x);
          this.aVelocity += 0.1 * cos(angle);
          other.aVelocity -= 0.1 * cos(angle);
        }
      }
    }
  }

  display() {
    stroke(0);
    if (this.dragging) {
      fill(255);
    } else {
      fill(175);
    }
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    ellipse(this.position.x, this.position.y, 48, 48);
  }

  clicked(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < 24) {
      this.dragging = true;
      this.aVelocity = 0;
    }
  }

  stopDragging() {
    this.dragging = false;
  }
}
